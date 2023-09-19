package main

import "syscall/js"

func Add(this js.Value, args []js.Value) interface{} {
	n1, n2 := args[0].Int(), args[1].Int()
	return js.ValueOf(n1 + n2)
	
}

func Echo(this js.Value, args []js.Value) interface{} {
	gMsg := args[0].String()
	println(gMsg)
	return js.Null()
}


func main() {
	done := make(chan int, 0)
	
	js.Global().Set("add", js.FuncOf(Add))
	js.Global().Set("echo", js.FuncOf(Echo))

	<- done
}