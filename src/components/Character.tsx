import * as React from 'react';

interface CharacterProps {
    name: string;

}

const Character = (props: CharacterProps) => (
    <div>
        Name: {props.name}
    </div>
);

export default Character;
