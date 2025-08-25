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

export interface MainLink {
	title: string,
	url: string,
	description: string
}

export interface AboutusData {
	projectDescription: string,
	mainLinks: MainLink[],
	sitemap: AppSection[]
}