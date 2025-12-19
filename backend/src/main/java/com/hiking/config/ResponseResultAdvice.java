package com.hiking.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiking.common.PageResult;
import com.hiking.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * 统一响应体封装，自动将非 Result 类型包装成 Result。
 */
@RestControllerAdvice
@RequiredArgsConstructor
public class ResponseResultAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        Class<?> bodyType = returnType.getParameterType();
        if (Result.class.isAssignableFrom(bodyType)) {
            return false;
        }
        if (CharSequence.class.isAssignableFrom(bodyType)) {
            return false;
        }
        if (ResponseEntity.class.isAssignableFrom(bodyType)) {
            return false;
        }
        if (byte[].class.isAssignableFrom(bodyType)) {
            return false;
        }
        if (Resource.class.isAssignableFrom(bodyType)) {
            return false;
        }
        if (StreamingResponseBody.class.isAssignableFrom(bodyType)) {
            return false;
        }
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body == null) {
            return Result.success();
        }

        if (body instanceof Result || body instanceof PageResult) {
            return body;
        }
        if (body instanceof CharSequence) {
            return body;
        }
        if (body instanceof ResponseEntity) {
            return body;
        }
        if (body instanceof byte[] || body instanceof Resource || body instanceof StreamingResponseBody) {
            return body;
        }

        if (response instanceof ServletServerHttpResponse && MediaType.TEXT_PLAIN.equals(selectedContentType)) {
            // StringResponse needs manual serialization
            ServletServerHttpResponse servletResponse = (ServletServerHttpResponse) response;
            servletResponse.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            try {
                return objectMapper.writeValueAsString(Result.success(body));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Response 序列化失败", e);
            }
        }

        return Result.success(body);
    }
}

