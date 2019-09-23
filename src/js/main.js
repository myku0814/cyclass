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
            case "CE":
                input.value = "";
                break;
            case "=":{
                input.value = calculate(input.value);
                break;
            }
            default:
                input.value += ctr;
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
    if(c == 0 || c == 1 || c == 2 || c ==3 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9){
        return true;
    }
}
//c是否為數字的字元
function calculate(str){
    let stack = [];
    let postFix = [];
    for(let i=0; i<str.length; ++i){
        let c = str.charAt(i);
        if(isNumChar(c)){
            postFix.push(c);
        }
        //c放入postFix;
        else if(c == ")"){
            while(stack[stack.length - 1] != "("){
                postFix.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.pop();
        }
        //stack的top放入postFix;
        else{
            while(weight(c) <= weight(stack[stack.length - 1]) && stack[stack.length - 1] != "("){
                postFix.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.push(c);
        }
        // c是")"以外的其他運算子
        // "("是例外，在stack內部實權重最小
    }
    while(stack.length != 0){
        postFix.push(stack[stack.length - 1]);
        stack.pop();
    }
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
// 18.