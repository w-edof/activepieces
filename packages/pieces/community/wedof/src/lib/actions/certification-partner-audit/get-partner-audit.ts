import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const getPartnerAudit = createAction({
  auth: wedofAuth,
  name: 'getPartnerAudit',
  displayName: "Récupération d'un audit sur un partenariat via son ID",
  description: "Permet la récupération d'un audit sur un partenariat via son id associé au certifInfo de la certification et du siret du partenaire",
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
  },
  async run(context) {
      return (
        await httpClient.sendRequest({
          method: HttpMethod.GET,
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