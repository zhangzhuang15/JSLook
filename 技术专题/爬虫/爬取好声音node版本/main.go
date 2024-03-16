package main

import (
	"flag"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
)

type Job struct {
	index int
	data  []string
}

// 将 ts 文件分批转化为mp4
func workOfTs(tsloc string, threads int, output string) {
	var total int32 = 0
	jobs := make(chan *Job, threads)

	waitGroup := sync.WaitGroup{}

	walkDir := func(dirPath string, subDir string, output string) {

		root := os.DirFS(dirPath)
		// 读取root/subDir目录下的所有文件(夹)名
		allFiles, err := fs.ReadDir(root, subDir)

		if err != nil {
			panic(err)
		}

		// 原地排序
		// filename形式为 xxxx_12.ts，根据12位置的数字，从小到大排序
		sort.SliceStable(allFiles, func(i, j int) bool {
			// 拿到文件名 xxxx_12.ts
			filenameofI := allFiles[i].Name()
			filenameOfJ := allFiles[j].Name()

			// 去除.ts后缀
			filenameofI, found := strings.CutSuffix(filenameofI, ".ts")
			if !found {
				return true
			}
			filenameOfJ, found = strings.CutSuffix(filenameOfJ, ".ts")
			if !found {
				return true
			}

			// 分割 ['xxxx', '12']
			seqOfI := strings.Split(filenameofI, "_")[1]
			seqOfJ := strings.Split(filenameOfJ, "_")[1]

			// '12' 转化为 int 类型的 12
			seqIntOfI, err := strconv.ParseInt(seqOfI, 10, 64)
			if err != nil {
				panic("cannot be parsed to int64")
			}
			seqIntOfJ, err := strconv.ParseInt(seqOfJ, 10, 64)
			if err != nil {
				panic("cannot be parsed to int64")
			}

			// 给出排序结果
			if seqIntOfI < seqIntOfJ {
				return true
			}

			return false
		})

		// 主协程制作任务
		headFiles := allFiles

		//groupSize := 500
		groupSize := int(len(allFiles) / threads)

		queue := make([]string, groupSize, groupSize)

		// 配合 queue 使用，实现 circle queue
		i := 0

		// 标记任务号
		job := 1

		for _, file := range headFiles {
			filename := file.Name()

			if strings.HasSuffix(filename, ".ts") {
				if i < groupSize {
					queue[i] = filename
				} else {
					value := make([]string, groupSize, groupSize)
					n := copy(value, queue)
					fmt.Println("copy: ", n)
					jobs <- &Job{index: job, data: value}
					job += 1
					i = 0
					queue[i] = filename
				}
				i += 1
			} else {
				fmt.Println("un .ts file: ", filename)
			}
		}

		if i > 0 {
			fmt.Println("final i:", i)
			jobs <- &Job{index: job, data: queue[:i]}
		}

	}

	defer func() {
		close(jobs)
		waitGroup.Wait()
	}()

	for i := 0; i < threads; i += 1 {
		waitGroup.Add(1)
		go func(sigIndex int) {
			for {
				select {
				case value, ok := <-jobs:
					if !ok {
						goto end
					}

					job := value.index

					filenames := value.data
					for index, val := range filenames {
						filenames[index] = fmt.Sprintf("%s/%s", tsloc, val)
					}

					s := "\"concat:" + strings.Join(filenames, "|") + "\""
					shellCmd := "ffmpeg -i" + " " + s + " " + "-c copy" + " " + fmt.Sprintf("%s/%d.mp4", output, job)

					tempSh, err := os.CreateTemp(".", "*.sh")
					tempSh.Truncate(0)
					tempSh.WriteString(shellCmd)
					tempSh.Close()

					_, err = os.ReadDir(output)
					if err != nil {
						err = os.MkdirAll(output, 0755)
						if err != nil {
							panic(err)
						}
					}

					cmd := exec.Command("sh", tempSh.Name())
					err = cmd.Run()
					if err != nil {
						fmt.Println(err)
					}

					os.Remove(tempSh.Name())

					_o := total
					_t := _o + int32(len(filenames))
					for {
						if atomic.CompareAndSwapInt32(&total, _o, _t) {
							break
						}
						_o = total
						_t = total + int32(len(filenames))
					}
					fmt.Println("total: ", _t)
				}
			}

		end:
			waitGroup.Done()

		}(i)
	}

	walkDir(".", tsloc, output)
}

func workOfMP4(locmp4 string, output string) {
	walkDir := func(loc string, output string) {
		allFiles, err := os.ReadDir(locmp4)
		if err != nil {
			panic(err)
		}

		sort.SliceStable(allFiles, func(i, j int) bool {
			filenameOfI, filenameOfJ := allFiles[i].Name(), allFiles[j].Name()

			filenameOfI, found := strings.CutSuffix(filenameOfI, ".mp4")
			if !found {
				return true
			}
			filenameOfJ, _ = strings.CutSuffix(filenameOfJ, ".mp4")

			fileISeq, err := strconv.ParseInt(filenameOfI, 10, 32)
			fileJSeq, err := strconv.ParseInt(filenameOfJ, 10, 32)

			if err != nil {
				panic(err)
			}

			if fileISeq < fileJSeq {
				return true
			}

			return false
		})

		s := "ffmpeg -i \"concat:"
		filenames := make([]string, len(allFiles))
		for i, val := range allFiles {
			filenames[i] = path.Join(locmp4, val.Name())
		}
		s += strings.Join(filenames, "|")
		s += "\"" + " -c copy " + path.Join(output, "output.mp4")

		tempSh, err := os.CreateTemp(".", "*.sh")
		if err != nil {
			panic(err)
		}

		_, err = tempSh.WriteString(s)
		if err != nil {
			panic(err)
		}

		tempSh.Close()

		_, err = os.ReadDir(output)
		if err != nil {
			err = os.MkdirAll(output, 0755)
			if err != nil {
				panic(err)
			}
		}

		cmd := exec.Command("sh", tempSh.Name())
		err = cmd.Run()
		if err != nil {
			fmt.Println("error when run sh ", tempSh.Name(), ": ", err)
		}

		os.Remove(tempSh.Name())

	}

	walkDir(locmp4, output)

}

func main() {
	workType := flag.Int("work", 0, "处理什么任务：0 不处理；1 处理ts；2处理mp4")

	tsLocation := flag.String("tsloc", "temp", "ts文件位于哪个文件夹下")

	mp4Location := flag.String("mp4loc", "temp", "mp4文件位于哪个文件夹下")

	output := flag.String("out", "outDir", "处理之后得到的文件，存储在哪个文件夹下")

	threads := flag.Int("threads", 1, "协程数量")

	flag.Parse()

	switch *workType {
	case 0:
		flag.PrintDefaults()
		return
	case 1:
		workOfTs(*tsLocation, *threads, *output)
		return
	case 2:
		workOfMP4(*mp4Location, *output)
		return
	default:
		flag.PrintDefaults()
	}
}
