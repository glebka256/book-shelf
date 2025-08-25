export interface RouteLink {
	name: string;
	path: string;
	description?: string;
}

export interface SectionRoute extends RouteLink {
	childRoutes: RouteLink[]
}

export interface AppSection {
	title: string;
	routes: SectionRoute[];
}