import { NavigationStep } from 'types/NavigationStep';

export enum CreatorFlowStep {
  Upload = 'Upload',
  Mint = 'Mint',
  Tags = 'Tags',
  List = 'List',
}

export const creatorFlowSteps: NavigationStep[] = [
  { name: CreatorFlowStep.Upload },
  { name: CreatorFlowStep.Mint },
  { name: CreatorFlowStep.Tags },
  { name: CreatorFlowStep.List },
];

export enum PrivateFlowStep {
  Setup = 'Set up',
  Confirm = 'Confirm',
  Send = 'Send',
}

export const privateSaleFlowSteps: NavigationStep[] = [
  { name: PrivateFlowStep.Setup },
  { name: PrivateFlowStep.Confirm },
  { name: PrivateFlowStep.Send },
];
