async function MakeRequest(request, method = "GET", params = null, body = null) {
    return await useFetch(useBrowserLocation().value.origin + "/api/" + request, {
        method: method,
        params: params,
        body: body,
    })
}

export async function PollPlayers(toast) {
    const { data, status, error } = await MakeRequest("scoreboard", "GET", null, null)

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