package com.ssafy.hellotoday.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi allApi() {
        return GroupedOpenApi.builder()
                .group("all")
                .pathsToMatch("/**")
                .build();
    }

    @Bean
    public GroupedOpenApi memberApi() {
        return GroupedOpenApi.builder()
                .group("member")
                .pathsToMatch("/members/**")
                .build();
    }

    @Bean
    public GroupedOpenApi searchApi() {
        return GroupedOpenApi.builder()
                .group("search")
                .pathsToMatch("/search/**")
                .build();
    }

    @Bean
    public GroupedOpenApi routineApi() {
        return GroupedOpenApi.builder()
                .group("routine")
                .pathsToMatch("/routine/**")
                .build();
    }

    @Bean
    public GroupedOpenApi mypageApi() {
        return GroupedOpenApi.builder()
                .group("mypage")
                .pathsToMatch("/mypage/**")
                .build();
    }

    @Bean
    public GroupedOpenApi followApi() {
        return GroupedOpenApi.builder()
                .group("follow")
                .pathsToMatch("/follow/**")
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info().title("API 명세서")
                        .description("오늘도, 안녕 API 명세서")
                        .version("v0.0.1"));
    }
}
