using QuickJS;
using QuickJS.Native;


var rt = new QuickJSRuntime();
var cx = rt.CreateContext();
rt.StdInitHandlers();
rt.SetDefaultModuleLoader();
cx.StdAddHelpers();
cx.InitModuleStd("std");
cx.InitModuleOS("os");


CreateFunction(cx, "ciao", (ctx, this_val, argc, argv) =>
{
    Console.WriteLine("{0} {1}", argv[0], argv[1]);
    return JSValue.Undefined;
}, 2);

CreateFunction(cx, "println", (ctx, this_val, argc, argv) =>
{
    Console.WriteLine("{0}", argv[0]);
    return JSValue.Undefined;
}, 1);


var jsCode = """
    function hello() {
        console.log('Hello World');
    };

    const h = () => console.log('Hello from Arrow Function!');

    const obj = {
        name: 'QuickJS',
        greet: function() {
            console.log('Hello from Object Method!');
        }
    };

    h();
    hello();
    console.log('aaa', JSON.stringify({ a: 1, b: 2 }, null, 2));

    const ciao2 = (a, b) => {
        console.log('ciao', b, a);
    };
    ciao2(1, 2);
    ciao(10, 20);
    obj.greet();

console.log("A");
ciao(1, 2);
console.log("B");
const p = new Person();
p.greet();
console.log("C");

""";



var personClassId = rt.RegisterNewClass("Person", new QuickJSClassDefinition(JSClassID.Create(), null, null, null));
var obj = QuickJSValue.Create(cx);

var defined = obj.DefineFunction("greet", (ctx, this_val, argc, argv) =>
{
    Console.WriteLine("Hello from Person.greet!");
    return JSValue.Undefined;
}, 0, JSPropertyFlags.Configurable | JSPropertyFlags.Writable);


cx.SetClassPrototype(personClassId, obj.NativeInstance);
var ctor = cx.CreateConstructorRaw("Person", (ctx, this_val, argc, argv) =>
{
    var obj = JSValue.CreateObject(ctx, personClassId);
    return obj;
}, 0);

var global = cx.GetGlobal();
global.DefineProperty("Person", ctor, JSPropertyFlags.Configurable | JSPropertyFlags.Writable);

jsCode = File.ReadAllText(@"C:\dev\QuickJsTest\react\bundle.js");
// jsCode = File.ReadAllText(@"C:\dev\cuo\main\ClassicUO\src\Mods\user-interface\dist\bundle.js");
var s = cx.Eval(jsCode, null, JSEvalFlags.Module);


rt.RunStdLoop(cx);

// global.Dispose();
// obj.Dispose();

rt.StdFreeHandlers();
cx.Dispose();
rt.Dispose();
Console.WriteLine();

static void CreateFunction(QuickJSContext cx, string name, JSCFunction fn, int argsCount)
{
    using var val = cx.GetGlobal();
    val.DefineFunction(name, fn, argsCount, JSPropertyFlags.Normal);
}
