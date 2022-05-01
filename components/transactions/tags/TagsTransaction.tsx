/* eslint-disable react/jsx-max-depth */
import React from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

import TransitionPane from 'components/animation/TransitionPane';
import Heading from 'components/base/Heading';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import TagsTextarea from './TagsTextarea';
import { TransactionCard } from 'components/layouts/TransactionLayoutV2';
import {
  PreviousPageButtonAnchor,
  PreviousPageLink,
} from 'components/navigation/PreviousPageButton';

import { Option } from './types';

import { TagSchema } from 'schemas/transaction';
import { ArtworkFragmentExtended } from 'graphql/hasura/hasura-fragments.generated';

import { notEmptyOrNil } from 'utils/helpers';

import {
  UpdateArtworkTagsVariables,
  useUpdateArtworkTags,
} from 'graphql/server/mutations/update-artwork-tags.generated';
import { styled } from 'stitches.config';

const FormSection = styled(Box, {
  paddingX: 72,
});
interface TagsTransactionProps {
  listArtworkPath: string;
  options: Option[];
  artwork: ArtworkFragmentExtended;
  title: string;
  isInCreatorFlow: boolean;
}

export default function TagsTransaction(
  props: TagsTransactionProps
): JSX.Element {
  const router = useRouter();

  const { artwork, listArtworkPath, options, title, isInCreatorFlow } = props;

  const { mutateAsync: updateArtworkTags } = useUpdateArtworkTags();

  const handleSubmit = async (values: UpdateArtworkTagsVariables) => {
    await updateArtworkTags({
      data: {
        id: values.data.id,
        tags: values.data.tags.filter(notEmptyOrNil),
      },
    });
    await router.push(listArtworkPath);
  };

  return (
    <>
      {!isInCreatorFlow && (
        <PreviousPageButtonAnchor
          css={{ display: 'none', '@bp4': { display: 'block' } }}
        >
          <PreviousPageLink href={listArtworkPath} />
        </PreviousPageButtonAnchor>
      )}

      <TransitionPane>
        <TransactionCard css={{ paddingY: 72 }}>
          <FormSection>
            <Formik<UpdateArtworkTagsVariables>
              onSubmit={handleSubmit}
              validationSchema={TagSchema}
              enableReinitialize
              initialValues={{
                data: {
                  id: artwork?.id,
                  tags: artwork?.tags,
                },
              }}
            >
              <Form style={{ display: 'flex', flexDirection: 'column' }}>
                <Heading
                  css={{
                    letterSpacing: '-0.8px',
                    fontSize: '$4',
                    marginBottom: '$4',
                  }}
                >
                  {title}
                </Heading>
                <Text
                  css={{
                    fontSize: '$1',
                    fontFamily: '$body',
                    lineHeight: 1.6,
                    marginBottom: '$7',
                  }}
                >
                  Add up to 10 tags to your NFT to help people find and discover
                  it across Foundation. Use the return key to add multiple.
                </Text>
                <TagsTextarea
                  name="data.tags"
                  options={options}
                  listArtworkPath={listArtworkPath}
                  isInCreatorFlow={isInCreatorFlow}
                />
              </Form>
            </Formik>
          </FormSection>
        </TransactionCard>
      </TransitionPane>
    </>
  );
}
