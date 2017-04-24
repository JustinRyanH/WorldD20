import React from 'react';
import { shallow } from 'enzyme'

import Character from './Character';

import { character1 as char } from '../sample-characters';

describe('Components CharacterSheet', () => {

    test('that the character has a name', () => {
        const CharacterSheet = shallow(<Character {...char} />);
        expect(CharacterSheet).toHaveText(`Name: ${char.name}`);
    });
});
