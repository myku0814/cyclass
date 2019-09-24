/**
 * @param [int] main
 * @param [Event] e
*/

function init(el){
    let input_scope = document.createElement("div"); //創造<div></div>標籤，代號叫input_scope(像指標)，這邊這個不是id
    input_scope.classList.add("input-scope"); //創造class名字為input-scope, 他是input_scope(上面一行那個名字叫input_scope的div)的class
    let input = document.createElement("input"); //創造<input></input>標籤，叫input
    input_scope.appendChild(input); // 名字為input_scope中有名字為input的，即<div class="input-scope"><input></input></div>，在"input區塊"有"可以輸入""

    let button_scope = document.createElement("div");
    button_scope.classList.add("button-scope"); //創造div，叫button_scope，順便創class給CSS用

    let button_chars = ["(",")","%","CE","7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"]; //用陣列先寫好排序
    
    function button_listener(e){
        let ctr = this.getAttribute('data-ctr'); //按下+按鈕的時候，取得data-ctr會取到什麼?。this指向被按的按鈕，這行即說取得被按的按鈕的data-ctr
        switch(ctr){
            case "CE":{
                input.value = "";
                break;
            }
            case "=":{
                input.value = calculate(input.value);
                break;
            }
            default:{
                input.value += ctr;
            }
        }
    }
//事件監聽函數。參數為e(event), 按按鈕顯示值在input
    for(let i=0; i<button_chars.length; i++){
        let button = document.createElement("span");
        button.classList.add("button");
        button.addEventListener("click", button_listener); //加入事件監聽，按按鈕執行button_listener
        let c = button_chars[i];
        button.innerHTML = c; //名叫button的span內容加字
        button.setAttribute('data-ctr', c); //把按鈕的data-ctr屬性設成c
        button_scope.appendChild(button);
    }
    //利用for迴圈將每個按鈕的字遍歷上去
    el.appendChild(input_scope);
    el.appendChild(button_scope);
    //都放入el
    el.classList.add("calc-main");
}
//變數el的函式

function weight(c){
    switch(c){
        case "+":
        case "-":{
            return 2;
            break;
        }
        case "*":
        case "/":{
            return 3;
            break;
        }
        case "(":{
            return 4;
        }
    }
}
//賦予c的權重
function isNumChar(c){
    return !isNaN(parseFloat(c));
}
//c是否為數字的字元，(c == 0 || c == 1 || c == 2 || c ==3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9)
function calculate(str){
    let stack = [];
    let postFix = []; //存後序式的array
    let tmp = ""; //暫存
    for(let i=0; i<str.length; ++i){
        let c = str.charAt(i);
        if(isNumChar(c)){
            tmp += c; //利用暫存將多位數串成字串
        }
        //c放入postFix
        else if(c == "."){
            tmp +=c;
        }
        //小數情況
        else if(c == ")"){
            if(tmp != ""){
                postFix.push(tmp);
                tmp = "";
            }
            //判斷tmp是否為空字串。舉例，第一個字是左刮號，postFix裡就多一個空字串，這種事不能出現w
            while(stack[stack.length - 1] != "("){
                postFix.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.pop();
        }
        //stack的top放入postFix;
        else{
            if(tmp != ""){
                postFix.push(tmp);
                tmp = "";
            }
            while(weight(c) <= weight(stack[stack.length - 1]) && stack[stack.length - 1] != "("){
                postFix.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.push(c);
        }
        // c是")"以外的其他運算子
        // "("是例外，在stack內部實權重最小
    }
    if(tmp != ""){
        postFix.push(tmp);
        tmp = "";
    }
    //假設字串尾是數字，temp會有值但沒放進去。因為只有「遇到非數字」，temp才會被放進去。但假如算式尾是數字，它就沒機會遇到非數字了。
    while(stack.length != 0){
        postFix.push(stack[stack.length - 1]);
        stack.pop();
    }
    console.log(postFix);
    //stack還沒空，把stack的top放入postFix
    let stk = [];
    for(let i=0; i<postFix.length; ++i){
        let p = postFix[i];
        //p是當前
        if(isNumChar(p)){
            stk.push(p);
            //丟入堆疊中
        }
        else{
            switch (p) {
                case "+":{
                    let a = parseFloat(stk.pop());
                    let b = parseFloat(stk.pop());
                    let c = b + a;
                    stk.push(c);
                    break;
                }
                case "-":{
                    let a = parseFloat(stk.pop());
                    let b = parseFloat(stk.pop());
                    let c = b - a;
                    stk.push(c);
                    break;
                }
                case "*":{
                    let a = parseFloat(stk.pop());
                    let b = parseFloat(stk.pop());
                    let c = b * a;
                    stk.push(c);
                    break;
                }
                case "/":{
                    let a = parseFloat(stk.pop());
                    let b = parseFloat(stk.pop());
                    let c = b / a;
                    stk.push(c);
                    break;
                }
                
            }
            
            //從堆疊拿兩個數字出來，根據運算子做計算後，放入堆疊
        }
    }
    return stk[0];
}

function ready(){
    let main = document.getElementById("main");
    init(main);
}
//叫div#main出來帶入函式init()
ready();

// 1.let input_scope = document.createElement("div")中let後面那個名字是 變數是讓他可以存取記憶體，一般JS不需要管資料型態可用let(當然用const之類比較快)
// 2.{}的地方稱為scope，for迴圈每次執行都是跳到新的scope
// 3.關於button 記憶體問題，JS他會自動翻記憶體，尋找到沒人用的記憶體就會把他釋放。C++是離開scope就釋放。而如果用new去要求記憶體來用，程式設計師要自己手動釋放記憶體。
// 4.一般取class名稱會用-
// 5.簡單理解成一個區塊用div，裡面塞東西用span，好排版跟控制
// 6.整理
// let div = document.createElement("div");
//  <div></div>
// div.classList.add("temp");
//  <div class="temp"></div>
// div.innerHTML = "hello";
//  <div class="temp">hello</div>
// div.setAttribute("data-t", "WHY??");
//  <div class="temp" data-t="WHY??">hello</div>
// 7.事件監聽。有個語法上的字叫「this」。在事件被觸發時（例如：按鈕A被點擊），Event Listener函數內部的this，會指向觸發這個事件的HTMLElement。也就是this會指向按鈕A。
// 8.平常我們呼叫函數，是程式設計者傳參數進去。但這個監聽函數變成是電腦傳參數並呼叫的，不是我們去呼叫(?。e其實函數內部沒用到，但慣例上會把他寫出來(?
// 9.a += b 等同a = a+b
// 10.HTML中的<input>標籤，其innerHTML無作用，要取得<input>內輸入了什麼值，得使用屬性value。例如：input.value。計算機的按鈕中，除了AC和=。
// 11.input.value一律是字串，故見12.點
// 12.如何字串串接？這邊要講到一個東西叫「運算子」。
//    運算子是什麼？其實隨處可見，例如1+1=2，「+」就是運算子。
//    在程式邏輯中，每種資料型態的運算子其實都是不同的定義。
//    對數字（number）而言，1+1=2。不用多說明。
//    對字串（string）而言，"1"+"1"="11"。這就是字串串接，例如："abc"+"132"="abc132"。
//    那數字+字串會發生什麼事呢？答案是無法運作，至少C++裡如果你把數字和字串相加會報錯。不過js裡，數字和字串相加的時候，js會自動把數字轉成字串，然後再相加。例如："1"+1 = "11"。
// 13.js的陣列就可以當堆疊用。js陣列有push()和pop()能用。
// 14. =計算運算用演算法。簡單說就是兩個陣列，一個放運算子(當堆疊用)，一個放輸出的postfix。http://www2.lssh.tp.edu.tw/~hlf/class-1/lang-c/stack2.htm
// 15.字串可以其實一個char陣列。例如let a = "abc"。那a.charAt(0) = "a"。可以理解成["a", "b", "c"]的0號是a。
// 16.string轉數字是parseInt(str, 10)或parseFloat(str)
// 17.let a = parseFloat(stk.pop());  也可以寫成  let a = parseFloat(stk[stk.length - 1]);
//    let b = parseFloat(stk.pop());             let b = parseFloat(stk[stk.length - 2]);
//    let c = b + a;                             let c = b + a;
//    stk.push(c);                               stk.pop();
//    break;                                     stk.pop();
//                                               stk.push(c);
//                                               break;
// 18.簡單說就是遍歷迴圈，forEach的參數是一個function，那個參數會從第一個元素開始，每次都被呼叫。也就是把陣列每一個值丟進去function跑，然後function的參數是被定義好的，因為是forEach本身去呼叫那個參數，第一個參數是元素本身，第二個參數是元素在ary的index
//    for (let i=0; i<ary.length; ++i){        同義於      ary.forEach(function(p, i){
//            let p = ary[i];                                  // do something
//    }                                                    });
// 20.其實js的function有一個簡化語法，叫箭頭函數
//    ary.forEach(function(p){                 同義於      ary.forEach(p => {
          // do something                                      // do something
//    });                                                  });
// 21.continue就是跳過那輪迴圈的意思
// 22.像forEach()、find()這種傳函數進去的，有個名詞叫回調函數(callback function)，forEach的回傳值是完全沒有意義，簡單說不會拿來作任何事，find()的回調函數是，如果回傳true就表示找到了，false就表示繼續找。
// 23.有個函數叫filter()，就是過濾。回調函數回傳false的時候，就表示那個值不要了。true就是留下來。
// 24.function add(a, b){                       同義於      let add = (a, b) => a+b;  //沒大括弧就是回傳值
//       return a+b;
//    }
// 25.map就是把陣列的值都換成新的，然後回傳一個新陣列。回調函數的回傳值就是新的值
// 26.every()就是回調函數每個都回傳true的話，才會回傳true
// 27.some就和every類似，簡單說就是至少一個符合，就會回傳true
// 28.多位數計算機其實很簡單(?簡單說就是先把數字用字串相加的方式串起來。用一個暫存的字串用來放正在串接的數字，每次遇到數字就把數字串上去。遇到運算子再把這個暫存字串放進postFix，然後把暫存字串出始化
//    舉個例，比放說123+23   let str = ""; //暫存字串，初始化就是空字串。迴圈首先遇到1，把1串上去。str = "1"。再來2和3分別串上去，str = "123"。然後遇到"+"了，不是數字，於是把str放進postFix，然後讓str變回""。
// 29.可以理解成所有進來的參數會是一個陣列。從最基本的來說，就是每個fuction()內部都有一個保留字可以存取，叫arguments。arguments是類似陣列（但不是Array）的東西。只是你也不用宣告，只要函數執行，內部就存取得到arguments。
// 30.保留字就是語法中定義的字。保留字簡單說就是不能隨便拿來當變數名稱。
// 31.從arguments(簡稱args)的角度來理解，
// 32.新語法spread operator。ES6 加入了新的運算子"..."Spread Operator，簡化了展開陣列的過程，應用上真的非常廣，像是取值、複製、合併、轉換型態、取代舊式 API...等等，這些都改善或簡化了 JavaScript 的邏輯程序，讓程式有了更多元的發展。
// 33.function f(a, b, theArgs){//做什麼}。 其中a是args[0]、b是args[1]、theArgs是args[2]~args[args.length-1]
// 34.反正可以先給你一個題目：寫一個function digitLenght(str)，str是一個數字的字串，例如"123.45"。這個函數會回傳str的小數長度，請利用String.split()實現這個函數。
// 35.標準三步驟就是：
//    1. git add --all  //簡單說就是掃描所有文件和資料夾（除了被gitignore忽略的），找到有改動的並把改了什麼記錄下來
//    2. git commit -m "隨便你要打什麼" //版本簡述
//    3. git push
// 36.