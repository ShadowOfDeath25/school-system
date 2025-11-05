import { appRoutes } from '@routes/routes.jsx';

const generateSidebarItems = (routeConfig) => {
    const panels = [];
    let panelCounter = 1;

    routeConfig.forEach(routeGroup => {
        if (routeGroup.handle?.sidebar?.header && routeGroup.children) {
            const panel = {
                panel: routeGroup.handle.sidebar.panel || `panel${panelCounter++}`,
                header: routeGroup.handle.sidebar.header,
                name: routeGroup.handle.sidebar.name,
                links: []
            };

            const groupFullPath = routeGroup.path ? `/${routeGroup.path}` : '';

            routeGroup.children.forEach(childRoute => {

                if (childRoute.handle?.sidebar?.title) {

                    const to = childRoute.index
                        ? groupFullPath || '/'
                        : `${groupFullPath}/${childRoute.path}`;

                    panel.links.push({
                        title: childRoute.handle.sidebar.title,
                        to: to.replace(/\/+/g, '/'),
                        action: childRoute.handle.action
                    });
                }
            });

            if (panel.links.length > 0) {
                panels.push(panel);
            }
        }
    });

    return panels;
};

const sidebarItems = generateSidebarItems(appRoutes);

export default sidebarItems;
