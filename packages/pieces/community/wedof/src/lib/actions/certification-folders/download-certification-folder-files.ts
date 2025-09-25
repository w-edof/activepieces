import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import { createAction, Property } from '@activepieces/pieces-framework';
import { wedofCommon } from '../../common/wedof';

export const downloadCertificationFolderFiles = createAction({
  auth: wedofAuth,
  name: 'downloadCertificationFolderFiles',
  displayName: 'Télécharger un document d\'un dossier de certification',
  description: 'Télécharger un document d\'un dossier de certification à partir de son id',
  props: {
    externalId: Property.ShortText({
      displayName: 'N° du dossier de certification',
      description:
        'Sélectionner la propriété {externalId} du dossier de certification',
      required: true,
    }),
    certificationFolderFileId: Property.ShortText({
      displayName: 'Id du document',
      description:
        'Sélectionner la propriété {certificationFolderFileId} du document',
      required: true,
    }),
  },
  async run(context) {
    return (
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url:
          wedofCommon.baseUrl +
          '/certificationFolders/' +
          context.propsValue.externalId + '/files/' + context.propsValue.certificationFolderFileId,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});
