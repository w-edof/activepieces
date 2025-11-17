import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const replayAudit = createAction({
  auth: wedofAuth,
  name: 'replayAudit',
  displayName: "Relancer un audit d'un partenariat de certification",
  description: "Permet de relancer l'audit d'un partenariat de certification si il a échoué",
  props: {
    certifInfo: Property.ShortText({
      displayName: 'N° certifInfo',
      description: "Permet de n'obtenir que les partenariats liés à la certification considérée",
      required: true,
    }),
    Id: Property.ShortText({
      displayName: 'N° Id',
      description: "Numéro ID de l'audit à récupérer",
      required: true,
    }),
    siret: Property.ShortText({
      displayName: 'N° de siret',
      description:
        'Sélectionner le SIRET du partenaire',
      required: true,
    }),
    restartAudit: Property.StaticDropdown({
            displayName: "Relancer l'audit si il a échoué",
            description: "Permet de relancer l'audit si il a échoué",
            required: true,
            options: {
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            }
        }),
  },
  async run(context) {
       const message = {
         restartAudit: context.propsValue.restartAudit ?? null,
        };
      return (
        await httpClient.sendRequest({
          method: HttpMethod.PUT,
          body: message,
          url:
            wedofCommon.baseUrl +
            '/certifications/' +
            context.propsValue.certifInfo + '/partners/' + context.propsValue.siret + '/audits/' + context.propsValue.Id,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
  },
});