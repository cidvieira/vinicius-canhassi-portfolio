interface TitleLinkMenuData {
    title: string
    path: string
    submenu?: TitleLinkMenuData[]
}

export const titleLink: Array<TitleLinkMenuData> = [
    {
        title: 'Início',
        path: '#top'
    },
    {
        title: 'Sobre Mim',
        path: '#sobre-mim'
    },
    {
        title: 'Portfólio',
        path: '#portfolio',
        submenu: [
            {
                title: 'DESIGN GRÁFICO',
                path: '#portfolio'
            },
            {
                title: 'Vídeos',
                path: '#videos'
            }
        ]
    }   
] 

