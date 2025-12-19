package com.hiking.domain;

import com.hiking.entity.User;
import lombok.Getter;

public class LoginUser {
    @Getter
    private final User user;

    public LoginUser(User user) {
        this.user = user;
    }

    public String getUsername() {
        return user.getUsername();
    }
}

