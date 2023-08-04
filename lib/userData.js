import { getToken } from "./authenticate";

async function fetchData(url, method, data=null)
{
    const token = await getToken();

    const headers = {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json'
    }

    const options = {
        method,
        headers
    }

    // if (data) {
    //     options.body = JSON.stringify(data);
    // }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, options)

    if(response.ok)
    {
        // console.log("reached")
        const data = await response.json()
        return data
    }
    else
    {
        return []
    }
}

export async function addToFavourites(id)
{
    const result = await fetchData(`favourites/${id}`, 'PUT')
    return result;
}

export async function removeFromFavourites(id)
{
    const result = await fetchData(`favourites/${id}`, 'DELETE')
    return result;
}

export async function getFavourites() {
    const result = await fetchData('favourites', 'GET');
    return result;
}

export async function addToHistory(id)
{
    const result = await fetchData(`history/${id}`, 'PUT');
    return result;
}

export async function removeFromHistory(id) {
    const result = await fetchData(`history/${id}`, 'DELETE');
    return result;
}

export async function getHistory() {
    const result = await fetchData('history', 'GET');
    return result;
}