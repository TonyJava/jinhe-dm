package com.jinhe.dm.data.sqlquery;

import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jinhe.tss.util.BeanUtil;

import freemarker.template.Configuration;
import freemarker.template.Template;

public class SOUtil {
	
	private static final Log logger = LogFactory.getLog(SOUtil.class);
 
	public static Map<String, Object> getProperties(AbstractSO so, String...ignore) {
		Set<String> ignoreNames = new HashSet<String>();
		if(ignore != null && ignore.length > 0) {
			ignoreNames.addAll(Arrays.asList(ignore));
		}
		   
		Map<String, Object> properties = BeanUtil.getProperties(so, ignoreNames);
		Map<String, Object> noNullProperties = new HashMap<String, Object>();
		for(String key : properties.keySet()) {
			Object value = properties.get(key);
			if(value != null) {
				if(key.endsWith("Codes")){
					value = filteringParameter(value.toString());
				}
				noNullProperties.put(key, value);
			}
			//转化为大写
			if(value instanceof String){
				value = ((String) value).toUpperCase();
			}
		}
				
		return noNullProperties;
	}
	
	public static Map<Integer, Object> generateQueryParametersMap(AbstractSO so) {
		Map<String, Object> properties = getProperties(so);
		Map<Integer, Object> parametersMap = new HashMap<Integer, Object>();
		
		String[] parameterNames = so.getParameterNames();
		if(parameterNames != null) {
			for(String parameterName : parameterNames) {
				Object value = properties.get(parameterName);
				if(value != null) {
					parametersMap.put(parametersMap.size() + 1, value);
				}
			}
		}
		
		return parametersMap;
	}
	
	private static String  filteringParameter(String param){
		if(param == null){
			return null;
		}
		if(param.contains(",")){
			return "\'" + param.replaceAll(",", "\',\'") + "\'";
		}
		else {
			return "\'" + param + "\'";
		}
	}
	
    public static String freemarkerParse(String script, AbstractSO so) {
    	return freemarkerParse(script, SOUtil.getProperties(so));
    }
 
    /** 用Freemarker引擎解析脚本 */
    public static String freemarkerParse(String script, Map<String, ?> requestMap) {
        try {
            Template temp = new Template("t.ftl", new StringReader(script), new Configuration());
            Writer out = new StringWriter();
            temp.process(requestMap, out);
            script = out.toString();
            out.flush();
        } catch (Exception e) {
        	logger.error("用Freemarker引擎解析脚本出错了", e);
            return script;
        }  
        return script;
    }
}
