import React, { useRef, useState } from 'react'
import "./scss/App.scss"
import Calc from 'ez-calculator'
import { Howl, Howler } from 'howler';
import clickSound from "./sounds/clickSound.mp3";
import { useEffect } from 'react';

const App = () => {

  const numberContainerRef = useRef();

  const values = [7, 8, 9, "DEL", 4, 5, 6, "+", 1, 2, 3, "-", ".", 0, "/", "x"]

  const [operation, SetOperation] = useState("0")

  useEffect(()=>{
    Howler.volume(1.0);
  },[])

  function PlaySound(src) {
    const sound = new Howl({
      src
    });
    sound.play();
  }

  const CreateButtons = () => {
    return (
      values.map((value, key) => {
        return (
          <button key={key} className={value === "DEL" ? 'delete-button' : 'number-button'} onClick={() => OnClick(value)} >{value}</button>
        )
      })
    )
  }

  const OnClick = (value) => {

    PlaySound(clickSound);
    switch (value) {
      case "DEL":
        Delete();
        break;

      default:
        OnNumbersClick(value);
        break;
    }
  }

  const OnNumbersClick = (value) => {

    if (numberContainerRef.current.innerHTML === "0") {
      numberContainerRef.current.innerHTML = value.toString();
    } else {

      if (value === "." && numberContainerRef.current.innerHTML.includes(".")) {
        return;
      }
      numberContainerRef.current.innerHTML += value.toString();
    }
    SetOperation(numberContainerRef.current.innerHTML);
  }

  const Delete = () => {

    let str = numberContainerRef.current.innerHTML;

    if (str.length > 1) {
      let newStr = str.slice(0, -1);
      numberContainerRef.current.innerHTML = newStr;
    } else {
      numberContainerRef.current.innerHTML = "0";
    }

    SetOperation(numberContainerRef.current.innerHTML);
    PlaySound(clickSound);
  }

  const Reset = () => {
    SetOperation("0");
    numberContainerRef.current.innerHTML = "0";
    PlaySound(clickSound);
  }

  const Result = () => {
    PlaySound(clickSound);
    let str = operation.replaceAll("x", "*");
    let result = Calc.calculate(str);

    if (!Number.isInteger(result)) {
      if (result.toString().includes(".")) {
        let newStr = result.toString().split(".")[1];
        if (newStr.length > 2) {
          numberContainerRef.current.innerHTML = result.toFixed(2);
          return;
        }
      }
    }

    numberContainerRef.current.innerHTML = result.toString();
  }

  return (
    <div className='app'>
      <div className="container">
        <h1 className="title"> calc</h1>
        <div ref={numberContainerRef} className="number-container">0</div>
        <div className="buttons">

          <div className="number-buttons">
            {
              CreateButtons()
            }
          </div>

          <div className="reset-equal-container">
            <button className="reset-button" onClick={Reset}>
              RESET
            </button>
            <button className="equal-button" onClick={Result}>
              =
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App