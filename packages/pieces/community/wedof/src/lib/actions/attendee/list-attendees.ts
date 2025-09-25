import { HttpMethod, QueryParams, httpClient } from '@activepieces/pieces-common';
import { wedofAuth } from '../../..';
import { createAction, Property } from '@activepieces/pieces-framework';
import { wedofCommon } from '../../common/wedof';

export const listAttendees = createAction({
    auth: wedofAuth,
    name: 'listAttendees',
    displayName: 'Liste tous les apprenants pour l\'organisme de l\'utilisateur courant',
    description: 'Récupère l\'ensemble des apprenants de l\'organisme de l\'utilisateur connecté',
    props: {
        query: Property.ShortText({
            displayName: 'Recherche',
            description: 'Permet d\'effectuer une recherche libre sur les champs \'prénom\', \'nom\' et \'email\'',
            required: false
        }),
        order: Property.StaticDropdown({
            displayName: 'Ordre',
            description: 'Tri les résultats par ordre ascendant ou descendant',
            required: false,
            defaultValue: 'desc',
            options: {
                options: [
                    { value: 'asc', label: 'Ascendant' },
                    { value: 'desc', label: 'Descendant' }
                ]
            }
        }),
        sort: Property.StaticDropdown({
            displayName: 'Tri',
            description: 'Trie les résultats sur un critère',
            required: false,
            defaultValue: 'lastName',
            options: {
                options: [
                    { value: 'lastName', label: "Prénom" },
                    { value: 'firstName', label: "Nom" }
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
    },
    async run(context) {
        const props = context.propsValue;
        const params = {
            query: props.query ?? null,
            limit: props.limit,
            page: props.page,
            sort: props.sort,
            order: props.order,
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
                url: wedofCommon.baseUrl + '/attendees',
                headers: {
                     'Content-Type': 'application/json',
                     'X-Api-Key': context.auth as string,
                },
            })
        ).body;
    }
});