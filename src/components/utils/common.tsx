import React, { ReactNode } from "react";

type TFirst = {
  buttonText: string;
  onClick: () => void;
};
type TSecond = {
  message: string;
  buttonText: string;
  onClick: () => void;
};

type TInner = {
  name: string;
};

type TThird = {
  dataItems: string[];
  InnerComponent: React.FC<TInner>;
};

const Page1Inner: React.FC<TInner> = (props) => {
  return <button>{props.name}</button>;
};

const Page2Inner: React.FC<TInner> = (props) => {
  return <p>{props.name}</p>;
};

function Page1() {
  return (
    <Common
      firstProps={{ buttonText: "helo", onClick: () => console.log("hi") }}
      secondProps={{
        buttonText: "bye",
        onClick: () => console.log("bye"),
        message: "ok",
      }}
      thirdProps={{
        dataItems: ["muku;", "narsh"],
        InnerComponent: Page1Inner,
      }}
    ></Common>
  );
}

function Page2() {
  return (
    <Common
      firstProps={{
        buttonText: "efwfwe",
        onClick: () => console.log("ewfwef"),
      }}
      secondProps={{
        buttonText: "bye",
        onClick: () => console.log("fwefw"),
        message: "fw",
      }}
      thirdProps={{
        dataItems: ["muku;", "narsh"],
        InnerComponent: Page2Inner,
      }}
    ></Common>
  );
}

export const Common: React.FC<{
  firstProps: TFirst;
  secondProps: TSecond;
  thirdProps: TThird;
}> = ({ firstProps, secondProps, thirdProps }) => {
  return (
    <div>
      <First {...firstProps} />
      <Second {...secondProps} />
      <Third {...thirdProps} />
    </div>
  );
};

const First: React.FC<TFirst> = (props) => {
  return <button onClick={props.onClick}>{props.buttonText}</button>;
};

const Second: React.FC<TSecond> = (props) => {
  return (
    <>
      {props.message}
      <button onClick={props.onClick}>{props.buttonText}</button>
    </>
  );
};

const Third: React.FC<TThird> = ({ InnerComponent, ...props }) => {
  return (
    <>
      <div>Start</div>
      {props.dataItems.map((itemName) => (
        <div key={itemName}>
          <InnerComponent name={itemName} />
        </div>
      ))}
      <div>End</div>
    </>
  );
};
