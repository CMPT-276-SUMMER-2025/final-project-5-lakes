import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AxisTitleSettings from '../project-src/components/editsave/AxisTitleSettings';
import ColorSettings from '../project-src/components/editsave/ColorSettings';
import FontSettings from '../project-src/components/editsave/FontSettings';
import GridLegendSettings from '../project-src/components/editsave/GridLegendSettings';
import TitleSettings from '../project-src/components/editsave/TitleSettings';
import DatasetSelection from '../project-src/components/editsave/DatasetSelection';

// Mock react-color to avoid issues with SketchPicker
jest.mock('react-color', () => ({
  // eslint-disable-next-line react/prop-types
  SketchPicker: ({ color, onChangeComplete, disableAlpha }) => (
    <div data-testid="sketch-picker">
      <input
        data-testid="color-input"
        value={color}
        onChange={(e) => onChangeComplete({ hex: e.target.value })}
      />
      <span data-testid="disable-alpha">{disableAlpha ? 'true' : 'false'}</span>
    </div>
  )
}));

describe('Chart Editing Testing', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('AxisTitleSettings Component', () => {
    const defaultProps = {
      tempXAxisTitle: 'X-axis',
      tempYAxisTitle: 'Y-axis',
      onXAxisTitleChange: jest.fn(),
      onYAxisTitleChange: jest.fn(),
      onUpdateXAxisTitle: jest.fn(),
      onUpdateYAxisTitle: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders axis title settings with correct initial values', () => {
      render(<AxisTitleSettings {...defaultProps} />);
      
      expect(screen.getByText('Edit X Axis Title')).toBeInTheDocument();
      expect(screen.getByText('Edit Y Axis Title')).toBeInTheDocument();
      
      const xAxisInput = screen.getByPlaceholderText('Enter X-axis title');
      const yAxisInput = screen.getByPlaceholderText('Enter Y-axis title');
      
      expect(xAxisInput).toHaveValue('X-axis');
      expect(yAxisInput).toHaveValue('Y-axis');
    });

    test('handles X-axis title input changes', async () => {
      render(<AxisTitleSettings {...defaultProps} />);
      
      const xAxisInput = screen.getByPlaceholderText('Enter X-axis title');
      await user.clear(xAxisInput);
      await user.type(xAxisInput, 'New X Title');
      
      expect(defaultProps.onXAxisTitleChange).toHaveBeenCalled();
    });

    test('handles Y-axis title input changes', async () => {
      render(<AxisTitleSettings {...defaultProps} />);
      
      const yAxisInput = screen.getByPlaceholderText('Enter Y-axis title');
      await user.clear(yAxisInput);
      await user.type(yAxisInput, 'New Y Title');
      
      expect(defaultProps.onYAxisTitleChange).toHaveBeenCalled();
    });

    test('calls update functions when update buttons are clicked', async () => {
      render(<AxisTitleSettings {...defaultProps} />);
      
      const updateButtons = screen.getAllByText('Update');
      
      await user.click(updateButtons[0]); // X-axis update
      await user.click(updateButtons[1]); // Y-axis update
      
      expect(defaultProps.onUpdateXAxisTitle).toHaveBeenCalledTimes(1);
      expect(defaultProps.onUpdateYAxisTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe('ColorSettings Component', () => {
    const mockChartConfig = {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [
          { label: 'Dataset 1', data: [1, 2, 3] },
          { label: 'Dataset 2', data: [4, 5, 6] }
        ]
      }
    };

    const defaultProps = {
      chartConfig: mockChartConfig,
      datasetSelected: 0,
      segmentSelected: 0,
      activePicker: null,
      tempBackgroundColor: '#36A2EB',
      tempTextColor: '#000000',
      onSetActivePicker: jest.fn(),
      onTempBackgroundColorChange: jest.fn(),
      onTempTextColorChange: jest.fn(),
      onConfirmBackgroundColor: jest.fn(),
      onConfirmTextColor: jest.fn(),
      onCancelColorPicker: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders color settings with dataset label', () => {
      render(<ColorSettings {...defaultProps} />);
      
      expect(screen.getByText('Edit Colour')).toBeInTheDocument();
      expect(screen.getByText('(Dataset 1)')).toBeInTheDocument();
      expect(screen.getByText('Chart Colour')).toBeInTheDocument();
      expect(screen.getByText('Text Colour')).toBeInTheDocument();
    });

    test('shows color picker when background color button is clicked', async () => {
      render(<ColorSettings {...defaultProps} />);
      
      const bgColorButton = screen.getByText('Chart Colour');
      await user.click(bgColorButton);
      
      expect(defaultProps.onSetActivePicker).toHaveBeenCalledWith('background');
    });

    test('shows color picker when text color button is clicked', async () => {
      render(<ColorSettings {...defaultProps} />);
      
      const textColorButton = screen.getByText('Text Colour');
      await user.click(textColorButton);
      
      expect(defaultProps.onSetActivePicker).toHaveBeenCalledWith('text');
    });

    test('renders color picker when activePicker is set', () => {
      const propsWithActivePicker = {
        ...defaultProps,
        activePicker: 'background'
      };
      
      render(<ColorSettings {...propsWithActivePicker} />);
      
      expect(screen.getByTestId('sketch-picker')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('handles color picker confirmation for background color', async () => {
      const propsWithActivePicker = {
        ...defaultProps,
        activePicker: 'background'
      };
      
      render(<ColorSettings {...propsWithActivePicker} />);
      
      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);
      
      expect(defaultProps.onConfirmBackgroundColor).toHaveBeenCalledTimes(1);
    });

    test('handles color picker confirmation for text color', async () => {
      const propsWithActivePicker = {
        ...defaultProps,
        activePicker: 'text'
      };
      
      render(<ColorSettings {...propsWithActivePicker} />);
      
      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);
      
      expect(defaultProps.onConfirmTextColor).toHaveBeenCalledTimes(1);
    });

    test('handles color picker cancellation', async () => {
      const propsWithActivePicker = {
        ...defaultProps,
        activePicker: 'background'
      };
      
      render(<ColorSettings {...propsWithActivePicker} />);
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(defaultProps.onCancelColorPicker).toHaveBeenCalledTimes(1);
    });

    test('handles pie chart display correctly', () => {
      const pieChartConfig = {
        type: 'pie',
        data: {
          labels: ['Slice 1', 'Slice 2'],
          datasets: [{ data: [30, 70] }]
        }
      };
      
      const pieProps = {
        ...defaultProps,
        chartConfig: pieChartConfig,
        segmentSelected: 0
      };
      
      render(<ColorSettings {...pieProps} />);
      
      expect(screen.getByText('(Slice 1)')).toBeInTheDocument();
    });
  });

  describe('FontSettings Component', () => {
    const defaultProps = {
      activeFontFamily: 'Noto Sans',
      fontSize: 14,
      onFontChange: jest.fn(),
      onFontSizeChange: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders font settings with correct initial values', () => {
      render(<FontSettings {...defaultProps} />);
      
      expect(screen.getByText('Edit Text')).toBeInTheDocument();
      
      const fontFamilySelect = screen.getByDisplayValue('Noto Sans');
      const fontSizeSelect = screen.getByDisplayValue('14');
      
      expect(fontFamilySelect).toBeInTheDocument();
      expect(fontSizeSelect).toBeInTheDocument();
    });

    test('displays all available font options', () => {
      render(<FontSettings {...defaultProps} />);
      
      const fontOptions = ['Noto Sans', 'Noto Serif', 'Noto Sans Display', 'Noto Color Emoji'];
      fontOptions.forEach(font => {
        expect(screen.getByText(font)).toBeInTheDocument();
      });
    });

    test('displays all available font size options', () => {
      render(<FontSettings {...defaultProps} />);
      
      const fontSizes = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32];
      fontSizes.forEach(size => {
        expect(screen.getByText(size.toString())).toBeInTheDocument();
      });
    });

    test('handles font family change', async () => {
      render(<FontSettings {...defaultProps} />);
      
      const fontFamilySelect = screen.getByDisplayValue('Noto Sans');
      await user.selectOptions(fontFamilySelect, 'Noto Serif');
      
      expect(defaultProps.onFontChange).toHaveBeenCalled();
    });

    test('handles font size change', async () => {
      render(<FontSettings {...defaultProps} />);
      
      const fontSizeSelect = screen.getByDisplayValue('14');
      await user.selectOptions(fontSizeSelect, '16');
      
      expect(defaultProps.onFontSizeChange).toHaveBeenCalled();
    });
  });

  describe('GridLegendSettings Component', () => {
    const defaultProps = {
      gridLines: true,
      legend: true,
      onGridLinesToggle: jest.fn(),
      onLegendToggle: jest.fn(),
      isPieChart: false
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders grid and legend settings for non-pie charts', () => {
      render(<GridLegendSettings {...defaultProps} />);
      
      expect(screen.getByText('Customize Grid Lines & Legend')).toBeInTheDocument();
      expect(screen.getByText('Disable Grid Lines')).toBeInTheDocument();
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();
    });

    test('renders only legend settings for pie charts', () => {
      const pieProps = { ...defaultProps, isPieChart: true };
      render(<GridLegendSettings {...pieProps} />);
      
      expect(screen.getByText('Customize Legend')).toBeInTheDocument();
      expect(screen.queryByText('Disable Grid Lines')).not.toBeInTheDocument();
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();
    });

    test('shows correct button text based on grid lines state', () => {
      render(<GridLegendSettings {...defaultProps} />);
      expect(screen.getByText('Disable Grid Lines')).toBeInTheDocument();
      
      const propsWithGridLinesOff = { ...defaultProps, gridLines: false };
      render(<GridLegendSettings {...propsWithGridLinesOff} />);
      expect(screen.getByText('Enable Grid Lines')).toBeInTheDocument();
    });

    test('shows correct button text based on legend state', () => {
      render(<GridLegendSettings {...defaultProps} />);
      expect(screen.getByText('Disable Legend')).toBeInTheDocument();
      
      const propsWithLegendOff = { ...defaultProps, legend: false };
      render(<GridLegendSettings {...propsWithLegendOff} />);
      expect(screen.getByText('Enable Legend')).toBeInTheDocument();
    });

    test('handles grid lines toggle', async () => {
      render(<GridLegendSettings {...defaultProps} />);
      
      const gridLinesButton = screen.getByText('Disable Grid Lines');
      await user.click(gridLinesButton);
      
      expect(defaultProps.onGridLinesToggle).toHaveBeenCalledTimes(1);
    });

    test('handles legend toggle', async () => {
      render(<GridLegendSettings {...defaultProps} />);
      
      const legendButton = screen.getByText('Disable Legend');
      await user.click(legendButton);
      
      expect(defaultProps.onLegendToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('TitleSettings Component', () => {
    const defaultProps = {
      tempTitle: 'Chart Title',
      onTitleChange: jest.fn(),
      onUpdateTitle: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders title settings with correct initial value', () => {
      render(<TitleSettings {...defaultProps} />);
      
      expect(screen.getByText('Chart Title')).toBeInTheDocument();
      
      const titleInput = screen.getByPlaceholderText('Enter chart title');
      expect(titleInput).toHaveValue('Chart Title');
    });

    test('handles title input changes', async () => {
      render(<TitleSettings {...defaultProps} />);
      
      const titleInput = screen.getByPlaceholderText('Enter chart title');
      await user.clear(titleInput);
      await user.type(titleInput, 'New Chart Title');
      
      expect(defaultProps.onTitleChange).toHaveBeenCalled();
    });

    test('calls update function when update button is clicked', async () => {
      render(<TitleSettings {...defaultProps} />);
      
      const updateButton = screen.getByText('Update');
      await user.click(updateButton);
      
      expect(defaultProps.onUpdateTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe('DatasetSelection Component', () => {
    const mockChartConfig = {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [
          { label: 'Sales', data: [1, 2, 3] },
          { label: 'Revenue', data: [4, 5, 6] }
        ]
      }
    };

    const defaultProps = {
      chartConfig: mockChartConfig,
      datasetSelected: 0,
      segmentSelected: 0,
      onDatasetSelect: jest.fn(),
      onSegmentSelect: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders dataset selection for bar charts', () => {
      render(<DatasetSelection {...defaultProps} />);
      
      expect(screen.getByText('Select Dataset')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Selected: Sales')).toBeInTheDocument();
    });

    test('renders segment selection for pie charts', () => {
      const pieChartConfig = {
        type: 'pie',
        data: {
          labels: ['Slice A', 'Slice B'],
          datasets: [{ data: [30, 70] }]
        }
      };
      
      const pieProps = {
        ...defaultProps,
        chartConfig: pieChartConfig
      };
      
      render(<DatasetSelection {...pieProps} />);
      
      expect(screen.getByText('Select Segment')).toBeInTheDocument();
      expect(screen.getByText('Slice A')).toBeInTheDocument();
      expect(screen.getByText('Slice B')).toBeInTheDocument();
      expect(screen.getByText('Selected: Slice A')).toBeInTheDocument();
    });

    test('handles dataset selection', async () => {
      render(<DatasetSelection {...defaultProps} />);
      
      const revenueButton = screen.getByText('Revenue');
      await user.click(revenueButton);
      
      expect(defaultProps.onDatasetSelect).toHaveBeenCalledWith(1);
    });

    test('handles segment selection for pie charts', async () => {
      const pieChartConfig = {
        type: 'pie',
        data: {
          labels: ['Slice A', 'Slice B'],
          datasets: [{ data: [30, 70] }]
        }
      };
      
      const pieProps = {
        ...defaultProps,
        chartConfig: pieChartConfig
      };
      
      render(<DatasetSelection {...pieProps} />);
      
      const sliceBButton = screen.getByText('Slice B');
      await user.click(sliceBButton);
      
      expect(defaultProps.onSegmentSelect).toHaveBeenCalledWith(1);
    });

    test('shows active state for selected dataset', () => {
      const propsWithSelection = {
        ...defaultProps,
        datasetSelected: 1
      };
      
      render(<DatasetSelection {...propsWithSelection} />);
      
      const revenueButton = screen.getByText('Revenue');
      expect(revenueButton).toHaveClass('bg-blue-600', 'text-white', 'border-blue-600');
    });

    test('does not render when only one dataset exists', () => {
      const singleDatasetConfig = {
        type: 'bar',
        data: {
          datasets: [{ label: 'Single Dataset', data: [1, 2, 3] }]
        }
      };
      
      const singleProps = {
        ...defaultProps,
        chartConfig: singleDatasetConfig
      };
      
      const { container } = render(<DatasetSelection {...singleProps} />);
      expect(container.firstChild).toBeNull();
    });

    test('handles charts with no labels gracefully', () => {
      const noLabelConfig = {
        type: 'bar',
        data: {
          datasets: [
            { data: [1, 2, 3] },
            { data: [4, 5, 6] }
          ]
        }
      };
      
      const noLabelProps = {
        ...defaultProps,
        chartConfig: noLabelConfig
      };
      
      render(<DatasetSelection {...noLabelProps} />);
      
      expect(screen.getByText('Dataset 1')).toBeInTheDocument();
      expect(screen.getByText('Dataset 2')).toBeInTheDocument();
      expect(screen.getByText('Selected: Dataset 1')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('color settings integrates properly with dataset selection', () => {
      const chartConfig = {
        type: 'bar',
        data: {
          datasets: [
            { label: 'Dataset 1', data: [1, 2, 3] },
            { label: 'Dataset 2', data: [4, 5, 6] }
          ]
        }
      };

      const colorProps = {
        chartConfig,
        datasetSelected: 1,
        segmentSelected: 0,
        activePicker: null,
        tempBackgroundColor: '#36A2EB',
        tempTextColor: '#000000',
        onSetActivePicker: jest.fn(),
        onTempBackgroundColorChange: jest.fn(),
        onTempTextColorChange: jest.fn(),
        onConfirmBackgroundColor: jest.fn(),
        onConfirmTextColor: jest.fn(),
        onCancelColorPicker: jest.fn()
      };

      render(<ColorSettings {...colorProps} />);
      
      expect(screen.getByText('(Dataset 2)')).toBeInTheDocument();
    });

    test('grid legend settings adapts to chart type', () => {
      const pieProps = {
        gridLines: true,
        legend: true,
        onGridLinesToggle: jest.fn(),
        onLegendToggle: jest.fn(),
        isPieChart: true
      };

      render(<GridLegendSettings {...pieProps} />);
      
      expect(screen.getByText('Customize Legend')).toBeInTheDocument();
      expect(screen.queryByText('Grid Lines')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles missing chart config in ColorSettings', () => {
      const propsWithoutConfig = {
        chartConfig: null,
        datasetSelected: 0,
        segmentSelected: 0,
        activePicker: null,
        tempBackgroundColor: '#36A2EB',
        tempTextColor: '#000000',
        onSetActivePicker: jest.fn(),
        onTempBackgroundColorChange: jest.fn(),
        onTempTextColorChange: jest.fn(),
        onConfirmBackgroundColor: jest.fn(),
        onConfirmTextColor: jest.fn(),
        onCancelColorPicker: jest.fn()
      };

      render(<ColorSettings {...propsWithoutConfig} />);
      
      expect(screen.getByText('Edit Colour')).toBeInTheDocument();
      expect(screen.queryByText(/Dataset|Segment/)).not.toBeInTheDocument();
    });

    test('handles missing chart config in DatasetSelection', () => {
      const propsWithoutConfig = {
        chartConfig: null,
        datasetSelected: 0,
        segmentSelected: 0,
        onDatasetSelect: jest.fn(),
        onSegmentSelect: jest.fn()
      };

      const { container } = render(<DatasetSelection {...propsWithoutConfig} />);
      expect(container.firstChild).toBeNull();
    });

    test('handles empty title gracefully', async () => {
      const props = {
        tempTitle: '',
        onTitleChange: jest.fn(),
        onUpdateTitle: jest.fn()
      };

      render(<TitleSettings {...props} />);
      
      const titleInput = screen.getByPlaceholderText('Enter chart title');
      expect(titleInput).toHaveValue('');
      
      await userEvent.setup().type(titleInput, 'New Title');
      expect(props.onTitleChange).toHaveBeenCalled();
    });
  });
});