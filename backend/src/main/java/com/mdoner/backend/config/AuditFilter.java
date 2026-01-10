package com.mdoner.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.io.IOException;

@Configuration
@Order(1)
public class AuditFilter implements Filter {

    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT_LOG");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;

        // Basic Audit Log Entry
        // Format: [TIMESTAMP] [IP] [METHOD] [URI]
        // In production, this would go to a secure, tamper-proof log server (e.g.,
        // Elasticsearch/Splunk)
        auditLogger.info("ACCESS_REQUEST | IP: {} | OP: {} {}", req.getRemoteAddr(), req.getMethod(),
                req.getRequestURI());

        chain.doFilter(request, response);
    }
}
