import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import { createAction, Property } from '@activepieces/pieces-framework';
import { wedofCommon } from '../../common/wedof';

export const getCertificationFolderExternalId = createAction({
  auth: wedofAuth,
  name: 'getCertificationFolderExternalId',
  displayName: 'Récupération de l\'externalId d\'un dossier de certification',
  description:
    'Récupération de l\'externalId d\'un dossier de certification par son id',
  props: {
    id: Property.ShortText({
      displayName: 'Id du dossier',
      description:
        'Sélectionner la propriété {id} du dossier de certification',
      required: true,
    }),
  },
  async run(context) {
    return (
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: wedofCommon.baseUrl +
          '/certificationFolders/' +
          context.propsValue.id + '/getExternalId',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});
