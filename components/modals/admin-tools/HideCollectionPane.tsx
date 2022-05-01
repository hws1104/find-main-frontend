import { Formik, Form } from 'formik';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { useCollectionByUuid } from 'graphql/hasura/queries/collection-by-uuid.generated';
import {
  UpdateCollectionHiddenAtVariables,
  useUpdateCollectionHiddenAt,
} from 'graphql/server/mutations/update-collection-hidden-at.generated';

import { getFirstValue } from 'utils/helpers';

interface HideCollectionPaneProps {
  collectionId: string;
}

export default function HideCollectionPane(
  props: HideCollectionPaneProps
): JSX.Element {
  const { collectionId } = props;

  const {
    data: collection,
    isLoading: isCollectionLoading,
    refetch: refetchCollection,
  } = useCollectionByUuid(
    { id: collectionId },
    {
      enabled: Boolean(collectionId),
      select: (res) => getFirstValue(res.collections),
    }
  );

  const { mutateAsync: updateCollectionHiddenAt } =
    useUpdateCollectionHiddenAt();

  const handleSubmit = async (values: UpdateCollectionHiddenAtVariables) => {
    await updateCollectionHiddenAt({
      id: values.id,
      hidden: values.hidden,
    });
    await refetchCollection();
  };

  return (
    <Box css={{ padding: '$6' }}>
      <Formik<UpdateCollectionHiddenAtVariables>
        initialValues={{
          id: collection?.id,
          hidden: Boolean(collection?.hiddenAt),
        }}
        onSubmit={handleSubmit}
        enableReinitialize={!isCollectionLoading}
      >
        <Form>
          <Grid css={{ gap: '$4' }}>
            <CheckboxAndWrapper
              name="hidden"
              label="Collection hidden"
              description="Should this collection be hidden?"
            />

            <FormikSubmitButton
              label="Hide collection"
              submittingLabel="Hiding collection…"
              submittedLabel="Collection hidden"
            />
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
}
