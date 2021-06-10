# Image Processing API

Image Processing API is a Node.js express server that can be used in two ways:

1. Allows a user to place images into their frontend with the size set via URL parameters (and additional stylization if you choose) for rapid prototyping.
2. Used as a library to serve properly scaled versions of your images to the front end to reduce page load size. Rather than needing to resize and upload multiple copies of the same image to be used throughout your site, the API you create will handle resizing and serving stored images for you.

## Installation

```bash
yarn # npm install
```

## Usage

```bash
yarn start # npm start
# or
yarn run build # npm run build
```

## Test

```bash
yarn test # npm test
```

## Transform an image

### Request

`GET /api/images?filename=encenadaport&width=200&height=200&format=jpg&blur=true&grayscale=true`

| Parameter  | Example               | Type    | Required/Optional         |
| ---------- | --------------------- | ------- | ------------------------- |
| filename=  | filename=encenadaport | String  | Required                  |
| width=     | width=200             | Integer | Required                  |
| height=    | height=200            | Integer | Required                  |
| format=    | format=png            | String  | Optional (Default: jpg)   |
| blur=      | blur=true             | Boolean | Optional (Default: false) |
| grayscale= | grayscale=true        | Boolean | Optional (Default: false) |

## License

[MIT](https://choosealicense.com/licenses/mit/)
