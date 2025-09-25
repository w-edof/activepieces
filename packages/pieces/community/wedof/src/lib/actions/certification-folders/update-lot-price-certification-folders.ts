import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import { createAction, Property } from '@activepieces/pieces-framework';
import { wedofCommon } from '../../common/wedof';

export const updateLotPriceCertificationFolder = createAction({
  auth: wedofAuth,
  name: 'updateLotPriceCertificationFolder',
  displayName: 'Modifie le prix d\'un lot de dossiers',
  description: 'Procéder à la modification du prix de plusieurs dossiers',
  props: {
    certificationFolders : Property.Array({
      displayName: 'Liste des dossiers de certification à modifier',
      required: false,
        properties: {
          id: Property.ShortText({
            displayName: 'Id du dossier de certification',
            required: true,
          }),
          amountHt: Property.Number({
            displayName: 'Nouveau prix à appliquer',
            required: true,
          }),
        },
      }),
  },
  async run(context) {
    const message = {
      certificationFolders: context.propsValue.certificationFolders,
    };
    return (
      await httpClient.sendRequest({
        method: HttpMethod.POST,
        body: message,
        url:
          wedofCommon.baseUrl +
          '/certificationFolders/updateAsync',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});
