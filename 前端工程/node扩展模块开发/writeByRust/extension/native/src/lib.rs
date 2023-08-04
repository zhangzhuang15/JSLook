use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn the_higher(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let arg1: Handle<JsNumber> = cx.argument(0).unwrap();
    let arg2: Handle<JsNumber> = cx.argument(1).unwrap();

    unsafe {
        println!("ok Got it!");
    }

    if arg1.value() > arg2.value() {
        return Ok(cx.number(arg1.value()));
    }
    Ok(cx.number(arg2.value()))
}

register_module!(mut cx, {
    cx.export_function("hello", hello);
    cx.export_function("the_higher", the_higher)
});
