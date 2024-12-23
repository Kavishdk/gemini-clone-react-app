import React, { createContext, useEffect, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

        const delayPara = (index,nextWord) =>{
            setTimeout(function (){
                setResultData(prev=>prev+nextWord);
            },75*index)
        }

        const newChat = ()=>{
            setLoading(false);
            setShowResult(false)
        }

        
        const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response = await run(input);
        if(prompt!==undefined){
            response = await run(prompt);
            setRecentPrompt(prompt)
        }else{
            setPrevPrompt(prev=>[...prev,input]);
            setRecentPrompt(input)
            response=await run(input)
        }

        setRecentPrompt(input);
        setPrevPrompt(prev=>[...prev,input]);
        
        let responseArray = response.split("**");
        let newArray ="";
        for(let i =0;i<responseArray.length;i++){
            if(i===0 || i%2 !==1){
                newArray += responseArray[i];
            }else{
                newArray += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newArray2 = newArray.split("*").join("</br>")
        let newResponseArray = newArray2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord + " ")
        }
        setLoading(false);
        setInput("");
    };



    const contextValue = {
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        prevPrompt,
        setPrevPrompt,
        showResult,
        loading,
        resultData,
        onSent,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;