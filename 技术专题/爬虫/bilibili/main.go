package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
)

const Referer = "https://www.bilibili.com/"
const Origin = "https://www.bilibili.com"
const UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"
const Range = "bytes=0-512"

type PlayInfo struct {
	Data struct {
		Dash struct {
			Video []struct {
				BaseUrl   string
				BackupUrl []string
			}
			Audio []struct {
				BaseUrl   string
				BackupUrl []string
			}
		}
	}
}

func AddCommonHeaders(req *http.Request) {
	// we have to set these headers, no one could be ignored,
	// otherwise, our request will be rejected by bilibili server
	req.Header.Set("Referer", Referer)
	req.Header.Set("Origin", Origin)
	req.Header.Set("User-Agent", UserAgent)
}


func main() {
	var urlRef = flag.String("url", "", "bilibili url")
	var nameRef = flag.String("name",  "out", "define a name for your url, you can recognize it in outfile")
	flag.Parse()

	// 0. valid url
	if urlRef == nil {
		fmt.Println("--url is lost")
		return
	}

	if !strings.HasPrefix(*urlRef, "http") {
		fmt.Println("url is http or https protocol")
		return
	}


	// 1. download html from url
	res, err := http.Get(*urlRef)
	if err != nil {
		fmt.Println(0)
		return
	}
	defer res.Body.Close()
	htmlBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(2)
		return
	}
	html := string(htmlBytes)


	// 2. extract playinfo from html
	// you can get url of both video and audio;
	// how to get playinfo ? very easy, they exist in
	// <script>window.__playinfo__={...}</scrip> of html.
	reg, err := regexp.Compile("<script>window.__playinfo__=(.*?)</script>")
    if err != nil {
    	return
	}
	result := reg.FindStringSubmatch(html)
	var playInfo PlayInfo
	err = json.Unmarshal([]byte(result[1]), &playInfo)
	if err != nil {
		fmt.Println("json parse error")
		return
	}

	// 3. ready to download
	var wait sync.WaitGroup
	wait.Add(2)

	var results = make(chan string, 2)


	work := func(url string, fileSuffix string) {
		defer wait.Done()

		// 1 get total size of video
		req, err := http.NewRequest(http.MethodHead, url, nil)
		if err != nil {
			results <- "failed to download " + fileSuffix
			return
		}
		// we have to set these headers, no one could be ignored,
		// otherwise, our request will be rejected by bilibili server
		AddCommonHeaders(req)
		req.Header.Set("Range", Range)

		var client http.Client
		res, err := client.Do(req)
		if err != nil {
			results <- "error: when get size of " + fileSuffix + ", request is failed"
			return
		}
		// format: bytes 0-200/3333434, 3333434 is total size of video
		contentRangeValue := res.Header.Get("Content-Range")
		if contentRangeValue == "" {
			results <- "error: when get size of" + fileSuffix + ", server not responds Content-Range header"
			return
		}
		// extract total size
		totalSize := strings.Split(contentRangeValue, "/")[1]

		// 2 download file
		req, err = http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			results <- "error: when download " + fileSuffix + ", request is failed"
			return
		}
		AddCommonHeaders(req)
		req.Header.Set("Range", fmt.Sprintf("bytes=0-%s", totalSize))
		res, err = client.Do(req)
		if err != nil {
			results <- "error: when download " + fileSuffix + ", request is rejected"
		}
		file, err := os.OpenFile(
			fmt.Sprintf("./%s.%s", *nameRef, fileSuffix),
			os.O_RDWR | os.O_CREATE,
			fs.ModePerm)
		if err != nil {
			results <- "error: when create outfile for " + fileSuffix
			return
		}
		// we will read res.Body, so don't forget to close it
		defer res.Body.Close()
		written, err := io.Copy(file, res.Body)
		if err != nil {
			results <- "error: when download " + fileSuffix + ", failed to write to outfile"
			return
		}

		if written < int64(1024) {
			// < 1KB
			results <- fmt.Sprintf("download %s.%s, %dB", *nameRef, fileSuffix, written)

		} else if written < int64(1024 * 1024) {
			// < 1MB
			results <- fmt.Sprintf("download %s.%s, %fKB", *nameRef, fileSuffix, float64(written/1024))

		} else if written < int64(1024 * 1024 * 1024) {
           // < 1GB
			results <- fmt.Sprintf("download %s.%s, %fMB", *nameRef, fileSuffix, float64(written/1024*1024))

		} else {
			results <- fmt.Sprintf("download %s.%s, %fGB", *nameRef, fileSuffix, float64(written/1024*1024*1024))
		}
	}

	// 4. download video if exists
	videoUrl := playInfo.Data.Dash.Video[0].BaseUrl
	go work(videoUrl, "mp4")

	// 5. download audio if exists
	audioUrl := playInfo.Data.Dash.Audio[0].BaseUrl
	go work(audioUrl, "mp3")

	wait.Wait()

	i := len(results)
	for ;i > 0; i -= 1 {
		log := <- results
		fmt.Println(log)
	}
}
