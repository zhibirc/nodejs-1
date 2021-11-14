export default (data: any[], filters: string) => {
    let requestedKeys = filters
        .split(',')
        .map(field => field.trim())
        .filter(Boolean);

    if ( requestedKeys.length ) {
        data = data
            .map((item: any) => {
                for (const key in item) {
                    if ( !requestedKeys.includes(key) ) {
                        delete item[key];
                    }
                }

                return item;
            })
            .filter((item: any) => Object.keys(item).length);
    }

    return data;
}
