import type { Meta, StoryObj } from '@storybook/react';
import { TableBasic } from '@admiral-ds/table';

import { TableBasicTemplate } from './TableBasic.template.tsx';

import TableBasicTemplateRaw from './TableBasic.template.tsx?raw';

export default {
  title: 'Admiral-2.1/Table/TableBasic',
  component: TableBasic,
  parameters: {
    docs: {
      source: {
        language: 'tsx',
      },
    },
  },
  argTypes: {},
} as Meta<typeof TableBasic>;

export const DatePickerChangeLocale: StoryObj<typeof TableBasic> = {
  render: () => <TableBasicTemplate />,

  parameters: {
    docs: {
      source: {
        code: TableBasicTemplateRaw,
      },
    },
  },
  name: 'Table. Базовый пример',
};
