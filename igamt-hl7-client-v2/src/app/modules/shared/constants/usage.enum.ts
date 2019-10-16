export enum Usage {
  R = 'R', RE = 'RE', X = 'X', C = 'C', O = 'O', B = 'B', W = 'W', CAB = 'CAB',
}
export enum CodeUsage {
  P = 'P',
  R = 'R',
  E = 'E',
}

export const UsageOptions = [
  {
    label: 'R',
    value: Usage.R,
  },
  {
    label: 'RE',
    value: Usage.RE,
  },
  {
    label: 'C',
    value: Usage.C,
  },
  {
    label: 'C (A/B)',
    value: Usage.CAB,
  },
  {
    label: 'O',
    value: Usage.O,
  },
  {
    label: 'X',
    value: Usage.X,
  },
];

export const ConditionalUsageOptions = [
  {
    label: 'R',
    value: Usage.R,
  },
  {
    label: 'RE',
    value: Usage.RE,
  },
  {
    label: 'O',
    value: Usage.O,
  },
  {
    label: 'X',
    value: Usage.X,
  },
];
