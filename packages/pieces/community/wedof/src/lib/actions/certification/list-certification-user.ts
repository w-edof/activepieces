import {
  httpClient,
  HttpMethod,
  QueryParams,
} from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';
import { wedofCommon } from '../../common/wedof';

export const listCertifications = createAction({
  auth: wedofAuth,
  name: 'listCertifications',
  displayName: 'Lister toutes les certifications pour l\'organisme de l\'utilisateur courant',
  description: 'Récupère l\'ensemble des certifications de l\'organisme de l\'utilisateur connecté',

  props: {
    certifInfo: Property.ShortText({
      displayName: 'Identifiant de certification',
      description : 'Permet de filtrer les certifications par certifInfo (numéro de certif info)',
      required: true,
    }),
    certificationPartnerState: Property.StaticDropdown({
        displayName: 'État de synchronisation du partenariat',
        description: 'Permet de filter sur le statut du partenaire lié à la certification',
        options: {
            options: [
                { label: 'En attente', value: 'processing' },
                { label: 'Active', value: 'active' },
                { label: 'Annuler', value: 'aborted' },
                { label: 'Refusé', value: 'refused' },
                { label: 'revoqué', value: 'revoked' },
                { label: 'Suspendu', value: 'suspended' },
            ],
        },
        required: false
    }),
    certifierCustomer: Property.StaticDropdown({
      displayName: 'Client certificateur',
      required: false,
      options: {
        options: [
          { label: 'Oui', value: true },
          { label: 'Non', value: false },
        ],
      },
    }),
    enabled: Property.StaticDropdown({
      displayName: 'Etat de la certification',
      description: 'Permet de filtrer les certifications actives / inactives',
      required: false,
      options: {
        options: [
          { label: 'Active', value: true },
          { label: 'Inactif', value: false },
        ],
      },
    }),
    limit: Property.Number({
      displayName: 'Nombre de résultats',
      required: false,
      defaultValue: 100,
    }),
    order: Property.StaticDropdown({
      displayName: 'Ordre de tri',
      required: false,
      defaultValue: 'desc',
      options: {
        options: [
          { label: 'Ascendant', value: 'asc' },
          { label: 'Descendant', value: 'desc' },
        ],
      },
    }),
    organismType: Property.StaticDropdown({
      displayName: 'Type d\'organisme',
      description: 'Permet de n\'obtenir que les certifications pour lesquelles l\'organisme est certificateur',
      required: false,
      defaultValue: 'all',
      options: {
        options: [
          { label: 'certificateur', value: 'certifier' },
          { label: 'partenaire', value: 'partner' },
          { label: 'tous', value: 'all' },
        ],
      },
    }),
    page: Property.Number({
      displayName: 'Numéro de page',
      required: false,
      defaultValue: 1,
    }),
    query: Property.ShortText({
      displayName: 'Recherche',
      description: 'Permet d\'effectuer une recherche libre sur les champs \'intitulé de la certification\', \'certif info\', \'rs code\' et \'rncp code\'.',
      required: false,
    }),
    siret: Property.ShortText({
      displayName: 'Siret',
      description: 'Permet de n\'obtenir que les certifications appartenant à l\'organisme de siret considéré - par défaut l\'organisme de l\'utilisateur courant',
      required: false,
    }),
    sort: Property.StaticDropdown({
      displayName: 'Trier par',
      description: 'Tri les résultats sur un critère - valeur par defaut intitulé de la certification',
      required: false,
      defaultValue: 'name',
      options: {
        options: [
          { label: 'Intitulé de la certification', value: 'name' },
          { label: 'Numéro de certif info', value: 'certifInfo' },
          { label: 'Date de création', value: 'createdOn' },
          { label: 'Date de dernière mise à jour', value: 'updatedOn' },
          { label: 'Date de début de validité cpf', value: 'cpfDateStart' },
          { label: 'Date de fin de validité cpf', value: 'cpfDateEnd' },
        ],
      },
    }),
    type: Property.StaticDropdown({
      displayName: 'Type de certification',
      description : 'Permet de filtrer les certifications par type (RS,RNCP)',
      required: false,
      options: {
        options: [
          { label: 'RS', value: 'RS' },
          { label: 'RNCP', value: 'RNCP' },
        ],
      },
    }),
  },

  async run(context) {
    const {
      certifInfo,
      certificationPartnerState,
      certifierCustomer,
      enabled,
      limit,
      order,
      organismType,
      page,
      query,
      siret,
      sort,
      type
    } = context.propsValue;

    const queryParams: QueryParams = {};
    if (certifInfo) queryParams['certifInfo'] = certifInfo;
    if (certificationPartnerState) queryParams['certificationPartnerState'] = certificationPartnerState;
    if (certifierCustomer !== undefined) queryParams['certifierCustomer'] = certifierCustomer.toString();
    if (enabled !== undefined) queryParams['enabled'] = enabled.toString();
    if (order) queryParams['order'] = order;
    if (organismType) queryParams['organismType'] = organismType;
    if (query) queryParams['query'] = query;
    if (siret) queryParams['siret'] = siret;
    if (sort) queryParams['sort'] = sort;
    if (limit !== undefined) queryParams['limit'] = limit.toString();
    if (order) queryParams['order'] = order;
    if (page !== undefined) queryParams['page'] = page.toString();
    if (sort) queryParams['sort'] = sort;
    if (type) queryParams['type'] = type;

    const url = `${wedofCommon.baseUrl}/certifications`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      queryParams,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': context.auth as string,
      },
    });

    return response.body;
  },
});
