package com.ssafy.hellotoday.api.service;

import com.ssafy.hellotoday.api.dto.follow.request.FollowSaveRequestDto;
import com.ssafy.hellotoday.api.dto.BaseResponseDto;
import com.ssafy.hellotoday.api.dto.follow.response.FollowResponseDto;
import com.ssafy.hellotoday.api.dto.member.response.MemberResponseDto;
import com.ssafy.hellotoday.common.exception.validator.FollowValidator;
import com.ssafy.hellotoday.common.exception.validator.MemberValidator;
import com.ssafy.hellotoday.common.util.constant.FollowResponseEnum;
import com.ssafy.hellotoday.db.entity.Follow;
import com.ssafy.hellotoday.db.entity.Member;
import com.ssafy.hellotoday.db.repository.FollowRepository;
import com.ssafy.hellotoday.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;

    private final FollowValidator followValidator;
    private final MemberValidator memberValidator;

    public List<MemberResponseDto> getFollowers(int memberId) {
        Member member = getMember(memberId);

        List<Follow> followers = followRepository.findAllByFollowing(member.getMemberId());
        return followers.stream()
                .map(follow -> MemberResponseDto.builder()
                        .memberId(follow.getFollower().getMemberId())
                        .email(follow.getFollower().getEmail())
                        .nickname(follow.getFollower().getNickname())
                        .stMsg(follow.getFollower().getStMsg())
                        .profilePath(follow.getFollower().getProfilePath())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 팔로우를 등록하는 메서드
     * @param followerId 팔로우 신청자의 memberId
     * @param followSaveRequestDto 팔로우 할 대상의 memberId를 담는 Dto
     * @return 팔로우 정상 등록 시 followId, followerId, followingId를 리턴, 에러 시 에러코드와 메세지 리턴
     */
    @Transactional
    public BaseResponseDto enrollFollow(int followerId, FollowSaveRequestDto followSaveRequestDto) {
        memberValidator.checkMembers(followerId, followSaveRequestDto.getFollowingId());

        Member follower = getMember(followerId);
        Member followee = getMember(followSaveRequestDto.getFollowingId());

        followValidator.checkFollowStatus(followRepository, follower, followee);

        int followId = saveFollow(follower, followee);

        return BaseResponseDto.builder()
                .success(true)
                .message(FollowResponseEnum.SUCCESS_ENROLL_FOLLOW.getName())
                .data(FollowResponseDto.builder()
                        .followId(followId)
                        .followerId(followerId)
                        .followingId(followSaveRequestDto.getFollowingId())
                        .build())
                .build();
    }

    @Transactional
    public int saveFollow(Member follower, Member followee) {
        Follow follow = Follow.builder()
                .follower(follower)
                .following(followee)
                .build();

        followRepository.save(follow);

        return follow.getFollowId();
    }

    private Member getMember(int memberId) {
        Optional<Member> member = memberRepository.findById(memberId);
        memberValidator.checkMember(member);
        return member.get();
    }
}
