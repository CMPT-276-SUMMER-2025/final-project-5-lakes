import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleSettings from '../project-src/components/editsave/TitleSettings';
import FontSettings from '../project-src/components/editsave/FontSettings';
import AxisTitleSettings from '../project-src/components/editsave/AxisTitleSettings';
import GridLegendSettings from '../project-src/components/editsave/GridLegendSettings';

describe('Chart Editing Components - Unit Tests', () => {
  
  describe('TitleSettings Unit Test', () => {
    test('renders with correct props', () => {
      const props = {
        tempTitle: 'My Chart Title',
        onTitleChange: jest.fn(),
        onUpdateTitle: jest.fn()
      };

      render(<TitleSettings {...props} />);
      
      expect(screen.getByText('Chart Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter chart title')).toHaveValue('My Chart Title');
      expect(screen.getByText('Update')).toBeInTheDocument();
    });

    test('calls onTitleChange when input value changes', async () => {
      const user = userEvent.setup();
      const mockOnTitleChange = jest.fn();
      const props = {
        tempTitle: 'Original Title',
        onTitleChange: mockOnTitleChange,
        onUpdateTitle: jest.fn()
      };

      render(<TitleSettings {...props} />);
      
      const input = screen.getByPlaceholderText('Enter chart title');
      await user.type(input, ' Updated');
      
      expect(mockOnTitleChange).toHaveBeenCalled();
    });

    test('calls onUpdateTitle when update button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnUpdateTitle = jest.fn();
      const props = {
        tempTitle: 'Title',
        onTitleChange: jest.fn(),
        onUpdateTitle: mockOnUpdateTitle
      };

      render(<TitleSettings {...props} />);
      
      const button = screen.getByText('Update');
      await user.click(button);
      
      expect(mockOnUpdateTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe('FontSettings Unit Test', () => {
    test('renders with correct initial values', () => {
      const props = {
        activeFontFamily: 'Noto Sans',
        fontSize: 16,
        onFontChange: jest.fn(),
        onFontSizeChange: jest.fn()
      };

      render(<FontSettings {...props} />);
      
      expect(screen.getByText('Edit Text')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Noto Sans')).toBeInTheDocument();
      expect(screen.getByDisplayValue('16')).toBeInTheDocument();
    });

    test('displays all font family options', () => {
      const props = {
        activeFontFamily: 'Noto Sans',
        fontSize: 14,
        onFontChange: jest.fn(),
        onFontSizeChange: jest.fn()
      };

      render(<FontSettings {...props} />);
      
      expect(screen.getByText('Noto Sans')).toBeInTheDocument();
      expect(screen.getByText('Noto Serif')).toBeInTheDocument();
      expect(screen.getByText('Noto Sans Display')).toBeInTheDocument();
      expect(screen.getByText('Noto Color Emoji')).toBeInTheDocument();
    });

    test('calls onFontChange when font family is changed', async () => {
      const user = userEvent.setup();
      const mockOnFontChange = jest.fn();
      const props = {
        activeFontFamily: 'Noto Sans',
        fontSize: 14,
        onFontChange: mockOnFontChange,
        onFontSizeChange: jest.fn()
      };

      render(<FontSettings {...props} />);
      
      const fontSelect = screen.getByDisplayValue('Noto Sans');
      await user.selectOptions(fontSelect, 'Noto Serif');
      
      expect(mockOnFontChange).toHaveBeenCalled();
    });

    test('calls onFontSizeChange when font size is changed', async () => {
      const user = userEvent.setup();
      const mockOnFontSizeChange = jest.fn();
      const props = {
        activeFontFamily: 'Noto Sans',
        fontSize: 14,
        onFontChange: jest.fn(),
        onFontSizeChange: mockOnFontSizeChange
      };

      render(<FontSettings {...props} />);
      
      const sizeSelect = screen.getByDisplayValue('14');
      await user.selectOptions(sizeSelect, '18');
      
      expect(mockOnFontSizeChange).toHaveBeenCalled();
    });
  });

  describe('AxisTitleSettings Unit Test', () => {
    test('renders both X and Y axis sections', () => {
      const props = {
        tempXAxisTitle: 'X Axis',
        tempYAxisTitle: 'Y Axis',
        onXAxisTitleChange: jest.fn(),
        onYAxisTitleChange: jest.fn(),
        onUpdateXAxisTitle: jest.fn(),
        onUpdateYAxisTitle: jest.fn()
      };

      render(<AxisTitleSettings {...props} />);
      
      expect(screen.getByText('Edit X Axis Title')).toBeInTheDocument();
      expect(screen.getByText('Edit Y Axis Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter X-axis title')).toHaveValue('X Axis');
      expect(screen.getByPlaceholderText('Enter Y-axis title')).toHaveValue('Y Axis');
    });

    test('calls correct callbacks for X-axis interactions', async () => {
      const user = userEvent.setup();
      const mockXChange = jest.fn();
      const mockXUpdate = jest.fn();
      const props = {
        tempXAxisTitle: 'Categories',
        tempYAxisTitle: 'Values',
        onXAxisTitleChange: mockXChange,
        onYAxisTitleChange: jest.fn(),
        onUpdateXAxisTitle: mockXUpdate,
        onUpdateYAxisTitle: jest.fn()
      };

      render(<AxisTitleSettings {...props} />);
      
      // Test X-axis input change
      const xInput = screen.getByPlaceholderText('Enter X-axis title');
      await user.type(xInput, ' Modified');
      expect(mockXChange).toHaveBeenCalled();
      
      // Test X-axis update button
      const updateButtons = screen.getAllByText('Update');
      await user.click(updateButtons[0]); // First update button is X-axis
      expect(mockXUpdate).toHaveBeenCalledTimes(1);
    });

    test('calls correct callbacks for Y-axis interactions', async () => {
      const user = userEvent.setup();
      const mockYChange = jest.fn();
      const mockYUpdate = jest.fn();
      const props = {
        tempXAxisTitle: 'Categories',
        tempYAxisTitle: 'Values',
        onXAxisTitleChange: jest.fn(),
        onYAxisTitleChange: mockYChange,
        onUpdateXAxisTitle: jest.fn(),
        onUpdateYAxisTitle: mockYUpdate
      };

      render(<AxisTitleSettings {...props} />);
      
      // Test Y-axis input change
      const yInput = screen.getByPlaceholderText('Enter Y-axis title');
      await user.type(yInput, ' Modified');
      expect(mockYChange).toHaveBeenCalled();
      
      // Test Y-axis update button
      const updateButtons = screen.getAllByText('Update');
      await user.click(updateButtons[1]); // Second update button is Y-axis
      expect(mockYUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('GridLegendSettings Unit Test', () => {
    test('renders correctly for non-pie charts', () => {
      const props = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: jest.fn(),
        isPieChart: false
      };

      render(<GridLegendSettings {...props} />);
      
      expect(screen.getByText('Customize Grid Lines & Legend')).toBeInTheDocument();
      expect(screen.getByText('Disable Grid Lines')).toBeInTheDocument();
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();
    });

    test('renders correctly for pie charts', () => {
      const props = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: jest.fn(),
        isPieChart: true
      };

      render(<GridLegendSettings {...props} />);
      
      expect(screen.getByText('Customize Legend')).toBeInTheDocument();
      expect(screen.queryByText(/Grid Lines/)).not.toBeInTheDocument();
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();
    });

    test('shows correct button text based on state', () => {
      const enabledProps = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: jest.fn(),
        isPieChart: false
      };

      const { rerender } = render(<GridLegendSettings {...enabledProps} />);
      
      expect(screen.getByText('Disable Grid Lines')).toBeInTheDocument();
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();

      const disabledProps = {
        ...enabledProps,
        gridLines: false,
        legend: false
      };

      rerender(<GridLegendSettings {...disabledProps} />);
      
      expect(screen.getByText('Enable Grid Lines')).toBeInTheDocument();
      expect(screen.getByText('Enable Legend')).toBeInTheDocument();
    });

    test('calls onGridLinesToggle when grid button is clicked', async () => {
      const user = userEvent.setup();
      const mockGridToggle = jest.fn();
      const props = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: mockGridToggle,
        onLegendToggle: jest.fn(),
        isPieChart: false
      };

      render(<GridLegendSettings {...props} />);
      
      const gridButton = screen.getByText('Disable Grid Lines');
      await user.click(gridButton);
      
      expect(mockGridToggle).toHaveBeenCalledTimes(1);
    });

    test('calls onLegendToggle when legend button is clicked', async () => {
      const user = userEvent.setup();
      const mockLegendToggle = jest.fn();
      const props = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: mockLegendToggle,
        isPieChart: false
      };

      render(<GridLegendSettings {...props} />);
      
      const legendButton = screen.getByText('Disable Legend');
      await user.click(legendButton);
      
      expect(mockLegendToggle).toHaveBeenCalledTimes(1);
    });

    test('legend button takes full width for pie charts', () => {
      const props = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: jest.fn(),
        isPieChart: true
      };

      render(<GridLegendSettings {...props} />);
      
      const legendButton = screen.getByText('Disable Legend');
      expect(legendButton).toHaveClass('w-full');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('TitleSettings handles empty title', () => {
      const props = {
        tempTitle: '',
        onTitleChange: jest.fn(),
        onUpdateTitle: jest.fn()
      };

      render(<TitleSettings {...props} />);
      
      const input = screen.getByPlaceholderText('Enter chart title');
      expect(input).toHaveValue('');
    });

    test('FontSettings handles different font sizes', () => {
      const props = {
        activeFontFamily: 'Noto Serif',
        fontSize: 32,
        onFontChange: jest.fn(),
        onFontSizeChange: jest.fn()
      };

      render(<FontSettings {...props} />);
      
      expect(screen.getByDisplayValue('Noto Serif')).toBeInTheDocument();
      expect(screen.getByDisplayValue('32')).toBeInTheDocument();
    });

    test('AxisTitleSettings handles special characters in titles', () => {
      const props = {
        tempXAxisTitle: 'X-Axis: Sales (€)',
        tempYAxisTitle: 'Y-Axis: Revenue ($)',
        onXAxisTitleChange: jest.fn(),
        onYAxisTitleChange: jest.fn(),
        onUpdateXAxisTitle: jest.fn(),
        onUpdateYAxisTitle: jest.fn()
      };

      render(<AxisTitleSettings {...props} />);
      
      expect(screen.getByDisplayValue('X-Axis: Sales (€)')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Y-Axis: Revenue ($)')).toBeInTheDocument();
    });
  });
});