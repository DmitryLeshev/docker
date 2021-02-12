import { Request, Response } from 'express';

const helloMiddleware = (req: Request, res: Response, next) => {
	console.log('Hello from the middleware 👋');
	console.log('params: ', req.params);
	if (req.path === '/redirect' && req.method === 'GET') {
		console.log('Redirect Muahahah 😈');
		res.redirect('/');
	}
	if (req.params.id === '666') {
		console.log(`Oh no, don't do it 👹`);
		const { id } = req.params;
		console.log(req.params);
		res.redirect('/');
	}
	next();
};

export default helloMiddleware;
