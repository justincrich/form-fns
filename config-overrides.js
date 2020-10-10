const {override, addBabelPlugins} = require('customize-cra')
const isDevelopment = process.env.NODE_ENV === 'development'
module.exports = override(
  ...addBabelPlugins("babel-plugin-styled-components")
)

/**
 *   if(!isDevelopment){
    return config
  }

  tap({message: "Pre - Config"})

  
  // const tsLoader = getLoader(config.module.rules,(rule)=>{
  //   return rule && rule.loader && rule.loader === 'string' &&
  //   rule.loader.includes('ts-loader')
  // })
  console.log(process.env.NODE_ENV)
  process.exit()
  return config;
 */