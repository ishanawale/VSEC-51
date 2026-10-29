import { useState } from "react";

export default function App(){
    const [a, setA] = useState("");
    const [b, setB]= useState("");
    const [result,setResult] = useState("");

    function calculate(op){
        let x = Number(a);
        let y = Number(b);

        if(a ==="" || b===""){
            setResult("enter both no ");
            return;
        }

        if(op==="+")setResult(x+y);
        if(op==="-")setResult(x-y);
        if(op==="*")setResult(x*y);
        if(op==="/"){
            setResult(y===0 ? "you cannot divide by zero": x/y);
        }
    }

    return(
        <div>
            <h2>Simple calculator</h2>
            <input type="numder"
                placeholder="First"
                value = {a}
                onChange={e=> setA(e.target.value)}
            />

            <input type="number"
                placeholder="second"
                value={b}
                onChange={e => setB(e.target.value)}
            />

            <button onClick={() => calculate("+")}>+</button><br></br>
            <button onClick={() => calculate("-")}>-</button><br></br>
            <button onClick={() => calculate("*")}>*</button><br></br>
            <button onClick={() => calculate("/")}>/</button>
                <h3>result: {result}</h3>
        </div>
    );
}