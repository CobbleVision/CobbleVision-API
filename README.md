# CobbleVision-API

This is the official SDK for the CobbleVision Computer Vision Marketplace &amp; SaaS. With this SDK using computer vision is easier and less complex then ever. Use this SDK after signing up to process images, gifs and videos on cobblevision. 

You can find the official documentation for our API at: https://app.swaggerhub.com/domains-docs/CobbleVision/CobbleVision/

![Cover Image](https://github.com/CobbleVision/CobbleVision-API/blob/master/Visual_DataBase_Image.jpg "CobbleVision - Marketplace & SaaS for Computer Vision!")

## Documentation for CobbleVision SDK - NPM Package

* exports.setApiAuth(apiusername, apitoken) 
* exports.setDebugging(debugBool) 
* exports.uploadMediaFile(price_category, publicBool, name, tags, file) 
* exports.deleteMediaFile(IDArray)
* exports.launchCalculation(algorithms, media, type, [notificationURL]) 
* exports.waitForCalculationCompletion(calculationIDArray)
* exports.deleteCalculation(IDArray) 
* exports.getCalculationResult(idArray, returnOnlyStatusBool)
* exports.getCalculationVisualization(id, returnBase64Bool, width, height) 

#### exports.setApiAuth(apiusername, apitoken) 

This function sets your API Username and API Token for the SDK to use! It does not verify your auth!




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| apiusername | `string`  | - Username of API | &nbsp; |
| apitoken | `string`  | - Token of API | &nbsp; |




##### Returns


- `boolean`  Indicating Success of setting Auth Information



#### exports.setDebugging(debugBool) 

This function sets your API Username and API Token for the SDK to use! It does not verify your auth!




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| debugBool | `boolean`  | - Boolean to trigger debuggging | &nbsp; |




##### Returns


- `boolean`  Indicating Success of setting Debug Information



#### exports.uploadMediaFile(price_category, publicBool, name, tags, file) 

This function uploads a media file to CobbleVision. You can find it after login in your media storage. Returns a response object with body, response and headers properties, deducted from npm request module




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| price_category | `string`  | - Either high, medium, low | &nbsp; |
| publicBool | `boolean`  | - Make Media available publicly or not? | &nbsp; |
| name | `string`  | - Name of Media (Non Unique) | &nbsp; |
| tags | `array`  | - Tag Names for Media - Array of Strings | &nbsp; |
| file | `buffer`  | - File Buffer from fs.readFile() - instance of UInt8Array; | &nbsp; |




##### Returns


- `Promise<Object>`  This return the Upload Media Response. The body is in JSON format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.deleteMediaFile(IDArray) 

This function deletes Media from CobbleVision




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| IDArray | `array`  | Array of ID's as Strings | &nbsp; |




##### Returns


- `Promise<Object>`  This return the Delete Media Response. The body is in JSON format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.launchCalculation(algorithms, media, type, [notificationURL]) 

Launch a calculation with CobbleVision's Web API. Returns a response object with body, response and headers properties, deducted from npm request module;




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| algorithms | `array`  | Array of Algorithm Names | &nbsp; |
| media | `array`  | Array of Media ID's | &nbsp; |
| type | `string`  | Type of Job - Currently Always "QueuedJob" | &nbsp; |
| notificationURL | `string`  | Optional - Notify user upon finishing calculation! | *Optional* |




##### Returns

- `Promise<Object>`  This returns the Launch Calculation Response. The body is in JSON format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.waitForCalculationCompletion(calculationIDArray) 

This function waits until the given calculation ID's are ready to be downloaded!




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| calculationIDArray | `array`  | Array of Calculation ID's | &nbsp; |




##### Returns


- `Promise<Object>`  This returns the Wait For Calculation Response. The body is in JSON format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.deleteCalculation(IDArray) 

This function deletes Result Files or calculations in status "waiting" from CobbleVision. You cannot delete finished jobs beyond their result files, as we keep them for billing purposes.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| IDArray | `array`  | Array of ID's as Strings | &nbsp; |




##### Returns


- `Promise<Object>`  This returns the Delete Calculation Response. The body is in JSON format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.getCalculationResult(idArray, returnOnlyStatusBool) 

Launch a calculation with CobbleVision's Web API. Returns a response object with body, response and headers properties, deducted from npm request module;




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| idArray | `array`  | ID of calculation to return result Array | &nbsp; |
| returnOnlyStatusBool | `boolean`  | Return full result or only status? See Doc for more detailed description! | &nbsp; |




##### Returns


- `Promise<Object>`  This returns the Get Calculation Result. The body is in json format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

#### exports.getCalculationVisualization(id, returnBase64Bool, width, height) 

Request your calculation result by ID with the CobbleVision API. Returns a response object with body, response and headers properties, deducted from npm request module;




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `array`  | ID of calculation to return result/check String | &nbsp; |
| returnBase64Bool | `boolean`  | Return Base64 String or image buffer as string? | &nbsp; |
| width | `number`  | target width of visualization file | &nbsp; |
| height | `number`  | target height of visualization file | &nbsp; |




##### Returns


- `Promise<Object>`  This returns the Get Calculation Visualization Result. The body is in binary format.

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| response | `object`  | On Resolve: This is the response from the request npm module | &nbsp; |
| body | `object`  | On Resolve: This is the body of the request npm module. | &nbsp; |
| headers | `object`  | On Resolve: This are the headers from the request npm module. | &nbsp; |
| error | `string`  | On Reject: Message of Error | *Optional* |
| code | `number`  | On Reject: Code of Error | *Optional* |

