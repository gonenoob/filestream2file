import FileSaver from 'file-saver'

export default (url, fileName='', cb) => {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true); 
	xhr.responseType = "blob";    // 返回类型blob
	xhr.withCredentials = true

	xhr.onload = async function () {
		// 请求完成
		if (this.status === 200) {
			let result = {}
			let blob = this.response;

			if (blob.type === 'application/json') {
				let r = await readJsonBlob(blob)
				Object.assign(result, r)
			} else {
				try { 
					let isFileSaverSupported = !!new Blob
	
					if (isFileSaverSupported) {
						FileSaver.saveAs(blob, fileName)
						result = {
							success: true,
							fileName
						}
					} else {
						throw Error('请使用chrome等高级浏览器')
					}
				} catch (e) {
					console.log(e + '')
				}
			}
			
			cb && cb(result)
		}
	}

	xhr.send()
}

async function readJsonBlob(blob) {
	if (!blob instanceof Blob) {
		return
	}

	let result = await readBlob(blob)

	if (result) {
		return JSON.parse(result)
	}

	return {}
}

function readBlob(blob) {
	if (!blob instanceof Blob) {
		return
	}

	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.addEventListener("loadend", function() {
			// reader.result 包含转化为类型数组的blob
			resolve(reader.result)
		})

		reader.addEventListener('error', function() {
			reject()
		})
		reader.readAsText(blob)
	})
}