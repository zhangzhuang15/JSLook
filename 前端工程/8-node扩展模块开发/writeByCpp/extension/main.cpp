#include <napi.h>
#include <iostream>

Napi::String Log(const Napi::CallbackInfo& callbackInfo) {
    Napi::Env env = callbackInfo.Env();
    Napi::String input = Napi::String::New(env, callbackInfo[0].As<Napi::String>().Utf8Value());
    return input;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "log"), Napi::Function::New(env, Log));
    return exports;
}

NODE_API_MODULE(quick, Init);