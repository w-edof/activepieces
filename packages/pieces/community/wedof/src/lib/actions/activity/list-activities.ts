import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, QueryParams, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const listActivities = createAction({
  auth: wedofAuth,
  name: 'listActivities',
  displayName: "Lister les activités",
  description: "Permet de lister les activités d'un dossier (Dossier de formation / Dossier de certification), un partenariat ou une proposition",
  props: {
    entityClass: Property.StaticDropdown({
      displayName: "Choisir le type de dossier",
      description: "Permet de n'obtenir que les dossiers dans le type considéré - par défaut tous les types sont retournés",
      required: true,
      options: {
        options: [
          {label: "Dossier de certification", value: "CertificationFolder"},
          {label: "Dossier de formation", value: "RegistrationFolder"},
          {label: "Partenariat", value: "CertificationPartner"},
          {label: "Proposition commerciale", value: "Proposal"},
        ],
        disabled: false,
      },
    }),
    entityId: Property.ShortText({
      displayName: 'N° du dossier',
      description:
        'Sélectionner la propriété {entityId} du dossier',
      required: true,
    }),
    csvColumns : Property.StaticMultiSelectDropdown({
            displayName: 'Colonnes CSV',
            description: 'Permet de choisir les colonnes souhaitées pour l\'export des activités au format csv',
            required: false,
            options: {
                options: [
                    { value: 'TITRE', label: 'Titre' },
                    { value: 'DESCRIPTION', label: 'Description' },
                    { value: 'TYPE', label: 'Type' },
                    { value: 'ORIGINE', label: 'Origine' },
                    { value: 'LIEN', label: 'Lien' },
                    { value: 'CHAMP_MODIFIE', label: 'Champ modifié' },
                    { value: 'ANCIENNE_VALEUR', label: 'Ancienne valeur' },
                    { value: 'NOUVELLE_VALEUR', label: 'Nouvelle valeur' },
                    { value: 'DATE_DEBUT', label: 'Date de début' },
                    { value: 'DATE_FIN', label: 'Date de fin' },
                    { value: 'DUREE (JOUR)', label: 'Durée (jour)' },
                    { value: 'INDICATEURS_QUALIOPI', label: 'Indicateurs Qualiopi' },
                    { value: 'UTILISATEUR', label: 'Utilisateur' },
                    { value: 'DATE_ÉCHEANCE', label: 'Date d\'échéance' },
                ]
        }
    }),
    done: Property.StaticDropdown({
      displayName: 'Etat',
      description:'Permet de filtrer les activités selon leur état \'fait\' (true) ou \'à faire\' (false)',
      required: false,
      defaultValue: true,
      options: {
        options: [
          { label: 'Fait', value: true },
          { label: 'À faire', value: false },
        ],
      },
    }),
    format: Property.StaticDropdown({
            displayName: 'Format',
            description: 'Permet d\'obtenir une liste des activités au format json ou csv',
            required: false,
            defaultValue: 'json',
            options: {
                options: [
                    { value: 'json', label: 'JSON' },
                    { value: 'csv', label: 'CSV' }
                ]
            }
     }),
     limit: Property.Number({
                displayName: 'Limite',
                description: 'Nombre d\'éléments retourné par requête',
                defaultValue: 100,
                required: false
    }),
    page: Property.Number({
                displayName: 'Page',
                description: 'Numéro de page de la requête',
                defaultValue: 1,
                required: false
    }),
    qualiopi: Property.StaticDropdown({
      displayName: 'Qualiopi',
      description:"Permet de filtrer les activités selon le fait qu'elles soient en lien avec Qualiopi",
      required: false,
      defaultValue: true,
      options: {
        options: [
          { label: 'Oui', value: true },
          { label: 'Non', value: false },
        ],
      },
    }),
    qualiopiIndicators:wedofCommon.qualiopiIndicators,
    type: Property.StaticMultiSelectDropdown({
      displayName: 'Type',
      description: 'Permet de filtrer les activités selon le type - par défaut tous les types sont retournés',
      required: false,
      defaultValue: ['all'],
      options: {
        options: [
        {
          label: 'tous',
          value: 'all',
        },
        {
          label: 'Créer',
          value: 'create',
        },
        {
          label: 'Mettre à jour',
          value: 'update',
        },
        {
          label: 'Mettre à jour l\'état',
          value: 'updateState',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Réunion',
          value: 'meeting',
        },
        {
          label: 'Examen',
          value: 'examination',
        },
        {
          label: 'Chat',
          value: 'chat',
        },
        {
          label: 'Formation',
          value: 'training',
        },
        {
          label: 'CDC',
          value: 'cdc',
        },
        {
          label: 'Remarque',
          value: 'remark',
        },
        {
          label: 'Téléphone',
          value: 'phone',
        },
        {
          label: 'SMS',
          value: 'sms',
        },
        ],
      },
    }),

  },
  async run(context) {
    const props = context.propsValue;
    const params = {
      csvColumns: props.csvColumns?.length ? props.csvColumns.join(',') : undefined,
      done: props.done,
      format: props.format,
      limit: props.limit,
      page: props.page,
      qualiopi: props.qualiopi,
      qualiopiIndicators: props.qualiopiIndicators ?? null,
      type: props.type,
    };
        const queryParams: QueryParams = {};
        Object.keys(params).forEach((value) => {
            const key = value as keyof typeof params;
            if (params[key] != null && params[key] != undefined) {
                queryParams[value] = params[key] as string;
            }
        });
        
        return (
            await httpClient.sendRequest({
                method: HttpMethod.GET,
                queryParams: queryParams,
                url: wedofCommon.baseUrl +
            '/activities/' +
            context.propsValue.entityClass +
            '/'+ context.propsValue.entityId,
                headers: {
                     'Content-Type': 'application/json',
                     'X-Api-Key': context.auth as string,
                },
            })
        ).body;
  },
});
