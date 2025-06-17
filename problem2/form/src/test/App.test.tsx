import App from '../App'; // Assuming App.js is in the same directory
import { fireEvent, queryByAttribute, render, screen, waitFor, type RenderResult } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import selectEvent from 'react-select-event'
import userEvent from '@testing-library/user-event';

const getById = queryByAttribute.bind(null, 'id');

describe('App Component', () => {
    let dom: RenderResult
    it('App renders correctly', async () => {
        dom = render(<App />);
        waitFor(() => {
            expect(screen.getByTestId('form')).toBeInTheDocument();
        })
        expect(screen.getByTestId('form')).toHaveFormValues({})
    });

    it('User can choose token', async () => {
        dom = render(<App />);
        const leftSelect = getById(dom.container, 'leftInput_select');
        if (leftSelect) {
            await selectEvent.select(leftSelect, ['BLUR'])
        }
        const rightSelect = getById(dom.container, 'rightInput_select');
        if (rightSelect) {
            await selectEvent.select(rightSelect, ['bNEO'])
        }
    });

    it('User can see correct amount and the button do work', async () => {
        dom = render(<App />);
        const leftSelect = getById(dom.container, 'leftInput_select');
        if (leftSelect) {
            await selectEvent.select(leftSelect, ['BLUR'])
        }
        const rightSelect = getById(dom.container, 'rightInput_select');
        if (rightSelect) {
            await selectEvent.select(rightSelect, ['bNEO'])
        }
        console.log(screen.debug(undefined, Infinity));

        const leftInput = screen.getByTestId('leftInput_input')
        fireEvent.change(leftInput, {target: {value: '23'}})
        expect(leftInput).toHaveValue(23)
        
        const convertButton = screen.getByText('Convert');
        await userEvent.click(convertButton);
        
        const rightInput = screen.getByTestId('rightInput_input')
        expect(rightInput).toHaveValue(0.671503)

        const swapButton = screen.getByTestId('switchIcon');
        await userEvent.click(swapButton);
        expect(rightInput).toHaveValue(787.785414)

    });
});