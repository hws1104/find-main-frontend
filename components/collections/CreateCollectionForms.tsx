import CreateCollectionForm from './forms/CreateCollectionForm';
import CollectionDeploy, { CollectionDeployProps } from './CollectionDeploy';

export enum CreateCollectionStep {
  Create,
  Deploy,
}

interface CreateCollectionFormsProps extends CollectionDeployProps {
  step: CreateCollectionStep;
}

export default function CreateCollectionForms(
  props: CreateCollectionFormsProps
): JSX.Element {
  const { step } = props;

  switch (step) {
    case CreateCollectionStep.Create:
      return <CreateCollectionForm />;
    case CreateCollectionStep.Deploy:
      return <CollectionDeploy {...props} />;
  }
}
