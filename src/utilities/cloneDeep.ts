export default (item: any[] | {[key: string]: any}) => JSON.parse(JSON.stringify(item));
