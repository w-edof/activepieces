import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import { wedofCommon } from '../../common/wedof';

export const declareCertificationFoldertoRegister = createAction({
  auth: wedofAuth,
  name: 'declareCertificationFoldertoRegister',
  displayName: "Déclare que le candidat a été enregistré pour passer l'examen",
  description: "Déclare que le candidat lié au dossier a été enregistré pour passer l'examen de certification",
  props: {
    externalId: Property.ShortText({
      displayName: 'N° du dossier de certification',
      description:
        'Sélectionner la propriété {externalId} du dossier de certification',
      required: true,
    }),
  },
  async run(context) {
    return (
      await httpClient.sendRequest({
        method: HttpMethod.POST,
        url:
          wedofCommon.baseUrl +
          '/certificationFolders/' +
          context.propsValue.externalId +
          '/toRegister',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});