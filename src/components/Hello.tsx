import * as React from 'react';

interface HelloProps {
  compiler: string,
 }

const Hello = (props: HelloProps) => {
  return (
    <div>Hello from {props.compiler}</div>
  );
}

export default Hello;