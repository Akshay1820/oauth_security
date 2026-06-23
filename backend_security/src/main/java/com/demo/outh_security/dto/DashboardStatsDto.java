package com.demo.outh_security.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DashboardStatsDto {
    private long totalUsers;
    private long adminCount;
    private long userCount;
    private long newUsersLast7Days;
}
