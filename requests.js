async function MakeRequest(request, method = "GET", params = null, body = null) {
    return await useFetch(useBrowserLocation().value.origin + "/api/" + request, {
        method: method,
        params: params,
        body: body
    });
}

export async function PollPlayers(toast) {
    //return [{"name":"BillBodkin","color":-65536,"timeDiff":0,"pits":0,"teamColor1":"#FED83D","teamColor2":"#FED83D"},{"name":"GamerStevee428","color":-16749167,"timeDiff":3000,"pits":0,"teamColor1":"#B02E26","teamColor2":"#B02E26"},{"name":"Dylian_","color":-16711936,"timeDiff":8050,"pits":0,"teamColor1":"#FED83D","teamColor2":"#FED83D"},{"name":"Marshall1211066","color":-16711936,"timeDiff":87600,"pits":0,"teamColor1":"#FFAA00","teamColor2":"#FFAA00"},{"name":"EnderTheRobber","color":-16711936,"timeDiff":94850,"pits":0,"teamColor1":"#5555FF","teamColor2":"#5555FF"}];

    const { data, status, error } = await MakeRequest("scoreboard", "GET", null, null);

    if(status.value === 'success') {
        return data.value;
    } else {
        toast.add({
            title: 'Error: ' + error.value.message,
            color: 'error',
        })
        throw new Error(error.value.message)
    }
}

export async function SendCameraControl(camera, name, toast) {
    const { data, status, error } = await MakeRequest("cameraCommand", "POST", null, {
        camera: camera,
        name: name
    })

    if(status.value === 'success') {
        return data.value;
    } else {
        toast.add({
            title: 'Error: ' + error.value.message,
            color: 'error',
        })
        throw new Error(error.value.message)
    }
}