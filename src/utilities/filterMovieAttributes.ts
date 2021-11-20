export default (data: any[], filters: string) => {
    let requestedKeys = filters
        .split(',')
        .map(field => field.trim())
        .filter(Boolean);

    if ( requestedKeys.length ) {
        data = data
            .map(
                (item: any) => Object
                    .keys(item)
                    .filter(key => requestedKeys.includes(key))
                    .reduce((result: Record<string, any>, key) => (result[key] = item[key]), {})
            ).filter((item: any) => Object.keys(item).length);
    }

    return data;
}
